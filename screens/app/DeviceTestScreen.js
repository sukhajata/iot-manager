import React from "react";
import { View, Text, ScrollView } from "react-native";

import MQTTManager from "../../scripts/MQTTManager";
import {
  getPhases,
  DEPLOYMENT_STATES
} from "../../scripts/deviceSummaryService";
import DeviceTestItem from "../../components/DeviceTestItem";
import { colors } from "../../styles/fields";
import Loading from "../../components/Loading";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import NiceButton from "../../components/NiceButton";
import { getUser } from "../../scripts/storageService";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import routes from "../../routes";
import styles from "../../styles/fields";

const mqttManager = new MQTTManager();

class DeviceTestScreen extends React.Component {
  state = {
    voltage: "",
    current: "",
    downlinkRSSI: "",
    downlinkSNR: "",
    uplinkRSSI: "",
    uplinkSNR: "",
    softwareVersion: "",
    errorMessage: null,
    detailsOfInstalls: [],
    submitDisabled: true
  };
  async componentDidMount() {
    console.log("mounted");
    try {
      await mqttManager.connectToBroker(this.receiveMessage);
    } catch (error) {
      this.setState({
        errorMessage: JSON.stringify(error)
      });
    }

    let detailsOfInstalls = [];
    const { currentSite } = this.props.siteContext;
    currentSite.Enclosures.forEach(enclosure => {
      enclosure.DetailsOfInstalls.forEach(detailsOfInstall => {
        detailsOfInstalls.push(detailsOfInstall);
      });
    });
    currentSite.DetailsOfInstalls.forEach(detailsOfInstall =>
      detailsOfInstalls.push(detailsOfInstall)
    );
    console.log(detailsOfInstalls);
    this.setState({ detailsOfInstalls });

    mqttManager.subscribeToDevices(
      detailsOfInstalls,
      this.onDeviceUpdated,
      this.onError
    );
  }

  onError = error => {
    console.log(error);
    this.setState({ errorMessage: JSON.stringify(error) });
  };

  onDeviceUpdated = detailsOfInstall => {
    //console.log(detailsOfInstall);
    const updatedDetailsOfInstalls = this.state.detailsOfInstalls.map(item => {
      if (detailsOfInstall.Device.Id === item.Device.Id) {
        return detailsOfInstall;
      }
      return item;
    });
    this.setState({
      detailsOfInstalls: updatedDetailsOfInstalls,
      submitDisabled: false
    });
  };

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /*
  receiveMessage = (topic, rawData) => {
    const dataString = rawData.toString();
    const message = JSON.parse(dataString);
    const timestamp = message.datapoints[0].timestamp * 1000;
    if (timestamp > this.connectionTime) {
      const latestReading = message.datapoints[0].data;
      console.log(
        `message from topic=${topic}, latestReading=${latestReading}, timestamp=${timestamp}`
      );
      let topicDetails = mqttManager.parseMQTTTopic(topic);
      console.log(`topic details:`, topicDetails);

      const { detailsOfInstalls } = this.state;
      if (detailsOfInstalls.length > 0) {
        const updated = detailsOfInstalls.map(detailsOfInstall => {
          if (
            detailsOfInstall.Device.CurrentBackendConfiguration.PPNumber ==
            topicDetails.PPNumber
          ) {
            detailsOfInstall.TestingState = TESTING_STATES.RECEIVED;
            DeviceTestResults.setValue(
              detailsOfInstall.TestResults,
              topicDetails,
              latestReading
            );
          }
          return detailsOfInstall;
        });
        this.setState({ detailsOfInstalls: updated });
      }
    }
  };*/

  _saveResults = async () => {
    clearInterval(this.intervalId);
    this.setState({ submitDisabled: true });
    const installationDeployments = [];
    const { currentSite } = this.props.siteContext;
    const user = await getUser();
    this.state.detailsOfInstalls.forEach(detail => {
      const deployment = {
        SiteFK: currentSite.Id,
        EnclosureFK: detail.EnclosureFK,
        DeviceFK: detail.Device.Id,
        DetailsOfInstallFK: detail.Id,
        DeployerUserFK: user.Id,
        InstallCheckResults: JSON.stringify(detail.TestResults),
        DeploymentState: DEPLOYMENT_STATES.DEPLOYED
      };
      installationDeployments.push(deployment);
    });
    try {
      this.asyncForEach(installationDeployments, async deployment => {
        await DeploymentDatabaseAPI.CreateInstallationDeployment(deployment);
      });
      this.props.navigation.navigate(routes.HOME_SCREEN);
    } catch (error) {
      this.setState({
        errorMessage: JSON.stringify(error)
      });
    }
  };

  async componentWillUnmount() {
    mqttManager.disconnect();
  }

  render() {
    const { errorMessage, detailsOfInstalls, submitDisabled } = this.state;
    return (
      <ScrollView style={{ margin: 10 }}>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <View>
          {detailsOfInstalls.length === 0 && (
            <View style={{ padding: 50 }}>
              <Loading />
            </View>
          )}
          {detailsOfInstalls.map(detailsOfInstall => (
            <DeviceTestItem
              key={detailsOfInstall.Id}
              icp={detailsOfInstall.ICPNumber}
              phases={getPhases(
                detailsOfInstall.MeteringRed,
                detailsOfInstall.MeteringWhite,
                detailsOfInstall.MeteringBlue
              )}
              premise={
                detailsOfInstall.MeteredPremiseLocation.AddressLine1 +
                ", " +
                detailsOfInstall.MeteredPremiseLocation.City
              }
              serialNumber={detailsOfInstall.Device.SerialNumber}
              testingState={detailsOfInstall.TestingState}
              results={detailsOfInstall.TestResults}
            />
          ))}
        </View>
        <NiceButton
          title="Save"
          onPress={() => this._saveResults()}
          disabled={submitDisabled}
        />
      </ScrollView>
    );
  }
}

const Wrapped = withCurrentSite(DeviceTestScreen);
Wrapped.navigationOptions = {
  title: "Device Tests"
};
export default Wrapped;
