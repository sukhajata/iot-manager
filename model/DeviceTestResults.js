export const READING_TAGS = {
  VOLTAGE: "v",
  CURRENT: "c",
  SOFTWARE: "software",
  SNR: "snr",
  RSSI: "rssi"
};

export const MESSAGE_TYPES = {
  UPLINK: "uplink",
  DOWNLINK: "downlink"
};

export const TESTING_STATES = {
  PENDING: "Test pending",
  SENDING: "Sending request",
  WAITING: "Waiting for results",
  RECEIVED: "Results received"
};

//ranges SNR
//+20 excellent +10 v good -20 bad
//RSSI
//-10 lowest

class DeviceTestResults {
  constructor() {
    this.Phase1 = {
      Voltage: null,
      Current: null
    };
    this.Phase2 = {
      Voltage: null,
      Current: null
    };
    this.Phase3 = {
      Voltage: null,
      Current: null
    };
    this.Software = 0;
    this.UplinkSNR = 0;
    this.DownlinkSNR = 0;
    this.UplinkRSSI = 0;
    this.DownlinkRSSI = 0;
    this.Received = false;
  }

  //static methods allow for serialization to JSON
  static setValue(testResults, topicDetails, latestReading) {
    const { readingTag, messageType, phase } = topicDetails;
    testResults.Received = true;
    switch (readingTag) {
      case READING_TAGS.VOLTAGE:
        switch (phase) {
          case 1:
            testResults.Phase1.Voltage = latestReading;
            break;
          case 2:
            testResults.Phase2.Voltage = latestReading;
            break;
          case 3:
            testResults.Phase3.Voltage = latestReading;
            break;
          default:
            throw new Error(
              "Invalid phase received for voltage reading " + phase.toString()
            );
        }
        break;
      case READING_TAGS.CURRENT:
        switch (phase) {
          case 1:
            testResults.Phase1.Current = latestReading;
            break;
          case 2:
            testResults.Phase2.Current = latestReading;
            break;
          case 3:
            testResults.Phase3.Current = latestReading;
            break;
          default:
            throw new Error(
              "Invalid phase received for current reading " + phase.toString()
            );
        }
        break;
      case READING_TAGS.RSSI:
        switch (messageType) {
          case MESSAGE_TYPES.UPLINK:
            testResults.UplinkRSSI = latestReading;
            break;
          case MESSAGE_TYPES.DOWNLINK:
            testResults.DownlinkRSSI = latestReading;
            break;
          default:
            throw new Error(
              "Invalid message type for rssi reading " + messageType
            );
        }
        break;
      case READING_TAGS.SNR:
        switch (messageType) {
          case MESSAGE_TYPES.UPLINK:
            testResults.UplinkSNR = latestReading;
            break;
          case MESSAGE_TYPES.DOWNLINK:
            testResults.DownlinkSNR = latestReading;
            break;
          default:
            throw new Error(
              "Invalid message type for rssi reading " + messageType
            );
        }
        break;
      case READING_TAGS.SOFTWARE:
        testResults.Software = latestReading;
        break;
      default:
        throw new Error("Unknown reading tag " + readingTag);
    }
  }

  static getValue(testResults, readingTag, phase = 0) {
    switch (readingTag) {
      case READING_TAGS.SOFTWARE:
        return testResults.Software;
      case READING_TAGS.VOLTAGE:
        switch (phase) {
          case 1:
            return testResults.Phase1.Voltage;
          case 2:
            return testResults.Phase2.Voltage;
          case 3:
            return testResults.Phase3.Voltage;
          default:
            return null;
        }
      case READING_TAGS.CURRENT:
        switch (phase) {
          case 1:
            return testResults.Phase1.Current;
          case 2:
            return testResults.Phase2.Current;
          case 3:
            return testResults.Phase3.Current;
          default:
            return null;
        }
      /*case READING_TAGS.SNR:
                switch (messageType) {
                    case MESSAGE_TYPES.UPLINK:
                        return this.UplinkSNR;
                    case MESSAGE_TYPES.DOWNLINK:
                        return this.DownlinkSNR;
                    default:
                        throw new Error("Invalid request to getValue " + readingTag + ", " + messageType);
                }
            case READING_TAGS.RSSI:
                switch (messageType) {
                    case MESSAGE_TYPES.UPLINK:
                        return this.UplinkRSSI;
                    case MESSAGE_TYPES.DOWNLINK:
                        return this.DownlinkRSSI;
                    default:
                        throw new Error("Invalid request to getValue " + readingTag + ", " + messageType);
                }*/
      default:
        return null;
    }
  }

  static signalBars(testResults, barCount) {
    let RSSI = 0;
    const DownlinkRSSI = testResults.DownlinkSNR;
    const DownlinkSNR = testResults.DownlinkRSSI;
    if (testResults.UplinkRSSI !== 0 && DownlinkRSSI !== 0) {
      RSSI = (testResults.UplinkRSSI + DownlinkRSSI) / 2;
    } else if (testResults.UplinkRSSI !== 0) {
      RSSI = testResults.UplinkRSSI;
    } else if (DownlinkRSSI !== 0) {
      RSSI = DownlinkRSSI;
    }
    let SNR = 0;
    if (testResults.UplinkSNR !== 0 && DownlinkRSSI !== 0) {
      SNR = (testResults.UplinkSNR + DownlinkSNR) / 2;
    } else if (testResults.UplinkSNR !== 0) {
      SNR = testResults.UplinkSNR;
    } else if (DownlinkSNR !== 0) {
      SNR = DownlinkSNR;
    }
    let RSSIStrength = 100 / -RSSI;
    let SNRStrength = SNR / 8;
    let strength = (RSSIStrength + SNRStrength * 0.3) / 1.5;
    const result = Math.max(
      1,
      Math.min(barCount, Math.floor(strength * barCount))
    );
    //console.log("Signal strength");
    //console.log(testResults);
    //console.log(`Bar count ${barCount}, result ${result}`);

    return result;
  }
}

export default DeviceTestResults;
