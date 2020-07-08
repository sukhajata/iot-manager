
import DeviceTestResults, { TESTING_STATES } from "../model/DeviceTestResults";
const mqtt = require("@taoqf/react-native-mqtt");

class MQTTManager {
  constructor() {
    this.deviceTopicsToSubscribe = {
      voltage: `inst/v/#`,
      current: `inst/c/#`,
      downlinkRSSI: `downlink/rssi/#`,
      downlinkSNR: `downlink/snr/#`,
      uplinkRSSI: `uplink/rssi/#`,
      uplinkSNR: `uplink/snr/#`,
      softwareVersion: `version/software/#`
    };
    this.requestQueue = [];
    this.currentQueueIndex = 0;
  }
  connectToBroker() {
    this.connectionTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      let host = "mqtts://m15.cloudmqtt.com:38124";
      let params = {
        username: "",
        password: "",
        port: 38124
      };
      this.client = mqtt.connect(host, params);

      //Handle connection
      this.client.once("connect", () => {
        console.log("MQTTManager connected to", host);
        resolve();
      });

      //Handle all bad events
      let events = ["error", "offline", "end", "disconnect"];
      for (let event of events) {
        this.client.once(event, msg => {
          console.log("MQTTManager", event);
          reject(event);
        });
      }

      //Handle messages using provided callback
      this.client.on("message", this.onMessage);
    });
  }

  disconnect() {
    clearInterval(this.intervalId);

    return new Promise((resolve, reject) => {
      this.client.end();
      this.client.once("end", resolve);
    });
  }

  subscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, err => {
        if (err) {
          console.log("error subscribing to ", topic, err);
          reject(err);
        }
        console.log("subscribed to ", topic);
        resolve();
      });
    });
  }

  publishToTopic(topic, message) {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, message, {}, err => {
        if (err) {
          console.log("error publishing to ", topic, err);
          reject(err);
        } else {
          console.log("published to ", topic);
          resolve();
        }
      });
    });
  }

  async subscribeToDevices(detailsOfInstalls, updateCallback, errorCallback) {
    this.detailsOfInstalls = detailsOfInstalls;
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;
    this.asyncForEach(detailsOfInstalls, async detailsOfInstall => {
      if (
        detailsOfInstall.Device.CurrentBackendConfiguration
          .MQTTConnectionString &&
        detailsOfInstall.Device.CurrentBackendConfiguration.MQTTConnectionString
          .length > 2
      ) {
        try {
          await this.subscribeToDevice(
            detailsOfInstall.Device.CurrentBackendConfiguration
              .MQTTConnectionString
          );
          const connectionString = this.MQTTConnectionStringToTopic(
            detailsOfInstall.Device.CurrentBackendConfiguration
              .MQTTConnectionString
          );
          const instTopic = connectionString + "/get/instmsg";
          this.requestQueue.push({
            detailsOfInstall,
            topic: instTopic
          });
          const processedTopic = connectionString + "/get/processedmsg";
          this.requestQueue.push({
            detailsOfInstall,
            topic: processedTopic
          });
        } catch (error) {
          errorCallback(error);
        }
      } else {
        errorCallback(
          `No MQTT connection string for device ${
            detailsOfInstall.Device.SerialNumber
          }`
        );
      }
    });
    //poll every 10 seconds
    //this.requestQueue.forEach(item => console.log(item.topic));
    this.requestDeviceInfo();
    this.intervalId = setInterval(() => this.requestDeviceInfo(), 10000);
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /**
   *
   * @param {string} DeviceMQTTConnectionString
   */
  async subscribeToDevice(DeviceMQTTConnectionString) {
    return new Promise((resolve, reject) => {
      //Use devices information to construct topic strings
      let mqttBaseTopic = this.MQTTConnectionStringToTopic(
        DeviceMQTTConnectionString
      );
      //Create a promise for subscribing to each topic
      let promises = [];
      for (let key in this.deviceTopicsToSubscribe) {
        let endTopic = this.deviceTopicsToSubscribe[key];
        let topic = `${mqttBaseTopic}/${endTopic}`;
        promises.push(this.subscribeToTopic(topic));
      }
      //Once all topics have been subscribed to, resolve
      Promise.all(promises).then(resolve);
    });
  }

  /**
   * Publish to device to get messages
   */
  requestDeviceInfo = () => {
    const request = this.requestQueue[this.currentQueueIndex];
    if (request) {
      this.publishToTopic(request.topic, "1");

      request.detailsOfInstall.TestingState = TESTING_STATES.WAITING;
      this.updateCallback(request.detailsOfInstall);
    }

    if (this.requestQueue[this.currentQueueIndex + 1]) {
      this.currentQueueIndex++;
    } else {
      this.currentQueueIndex = 0;
    }
  };

  onMessage = (topic, rawData) => {
    const dataString = rawData.toString();
    const message = JSON.parse(dataString);
    const timestamp = message.datapoints[0].timestamp * 1000;
    if (timestamp > this.connectionTime) {
      const latestReading = message.datapoints[0].data;
      console.log(
        `message from topic=${topic}, latestReading=${latestReading}, timestamp=${timestamp}`
      );
      let topicDetails = this.parseMQTTTopic(topic);
      console.log(`topic details:`, topicDetails);

      if (this.detailsOfInstalls.length > 0) {
        const detail = this.detailsOfInstalls.find(
          detailsOfInstall =>
            detailsOfInstall.Device.CurrentBackendConfiguration.PPNumber ==
            topicDetails.PPNumber
        );
        if (detail) {
          detail.TestingState = TESTING_STATES.RECEIVED;
          DeviceTestResults.setValue(
            detail.TestResults,
            topicDetails,
            latestReading
          );
          this.updateCallback(detail);
        } else {
          console.log("Couldn't find device to update ", topicDetails.PPNumber);
          console.log(this.detailsOfInstalls);
        }
      }
    }
  };

  /**
   *
   * @param {string} DeviceMQTTConnectionString Use devices MQTTConnectionString to construct topic string
   */
  MQTTConnectionStringToTopic(DeviceMQTTConnectionString) {
    let mqttDetails = this.parseMQTTString(DeviceMQTTConnectionString);
    let topic = `powerpilot/${mqttDetails.subtopic1}/${mqttDetails.subtopic2}/${
      mqttDetails.PPNumber
    }`;
    return topic;
  }

  /**
   * Takes an mqttString from DeviceInfo.CurrentBackendConfiguration.MQTTConnectionString
   * @param {string} mqttString
   * @returns {object} object with host, port, username, password, and subtopics.
   */
  parseMQTTString(mqttString) {
    let parts = mqttString.split(";");
    let mqttDetails = {
      host: parts[0],
      port: parts[1], //Port which the device uses to connect to MQTT, unusable for mobile app which must use websockets.
      username: parts[2],
      password: parts[3],
      PPNumber: parts[4], //eg: PP1100000116
      subtopic1: parts[5], //eg: testing2
      subtopic2: parts[6] //eg: fieldtester
    };
    return mqttDetails;
  }
  /**
   * Takes a topicString and returns the subtopics
   * @param {string} topicString
   */
  parseMQTTTopic(topicString) {
    let parts = topicString.split("/");
    let topicDetails = {
      subtopic1: parts[1], //eg: testing2
      subtopic2: parts[2], //eg: fieldtester
      PPNumber: parts[3], //eg: PP1100000116
      messageType: parts[4], //eg: inst (instantaneous)
      readingTag: parts[5], //eg: v (voltage)
      phase: null
    };
    //If it is a voltage or current reading, record the phase number
    if (topicDetails.readingTag === "v" || topicDetails.readingTag === "c") {
      topicDetails.phase = parseInt(parts[6]);
    }
    return topicDetails;
  }
}

export default MQTTManager;
