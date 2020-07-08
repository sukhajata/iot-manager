import React from "react";
import { View, ScrollView, Text } from "react-native";
import { MapView } from "expo";
import { Dimensions } from "react-native";

import DeviceInfoView from "../../components/DeviceInfoView";
import {
  InstallationDeployment,
  DeviceInfo,
  PremiseLocation
} from "../../scripts/DeploymentData";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import { DEPLOYMENT_STATES } from "../../scripts/deviceSummaryService";
import routes from "../../routes";
import NiceButton from "../../components/NiceButton";
import styles from "../../styles/fields";

class InstallationSummaryScreen extends React.Component {
  static navigationOptions = {
    title: "Installation Summary"
  };
  constructor(props) {
    super(props);
    this.state = {
      saveDisabled: false,
      errorMessage: null
    };
  }

  async _save() {
    this.setState({ saveDisabled: true, errorMessage: null });
    InstallationDeployment.DeploymentState = DEPLOYMENT_STATES.READY;
    try {
      await DeploymentDatabaseAPI.CreateInstallationDeployment(
        InstallationDeployment
      );
      this.setState({ saveDisabled: false });
      return true;
    } catch (error) {
      console.log(error);
      this.setState({
        errorMessage: error.message ? error.message : JSON.stringify(error),
        saveDisabled: false
      });
      return false;
    }
  }

  async _saveDetails() {
    const saved = await this._save();
    if (saved) {
      this.props.navigation.navigate(routes.HOME_SCREEN);
    }
  }

  async _completeInstall() {
    const saved = await this._save();
    if (saved) {
      this.props.navigation.navigate(routes.DEVICE_TEST_SCREEN);
    }
  }

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    const { saveDisabled, errorMessage } = this.state;

    return (
      <ScrollView
        style={{
          margin: 20
        }}
      >
        {errorMessage && (
          <Text style={[styles.errorText, { marginLeft: 20, marginRight: 20 }]}>
            {errorMessage}
          </Text>
        )}
        <DeviceInfoView
          deviceInfo={DeviceInfo}
          installationDeployment={InstallationDeployment}
          premiseLocation={PremiseLocation}
        />
        <MapView
          style={{
            height: Math.round(screenWidth / 2),
            padding: 10,
            margin: 10
          }}
          initialRegion={{
            latitude: InstallationDeployment.Latitude,
            longitude: InstallationDeployment.Longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: InstallationDeployment.Latitude,
              longitude: InstallationDeployment.Longitude,
              title: "Device location"
            }}
          />
        </MapView>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <NiceButton
            onPress={() => this._saveDetails()}
            title="Save Install Details"
            disabled={saveDisabled}
          />
          <NiceButton
            onPress={() => this._completeInstall()}
            title="Complete Install"
            disabled={saveDisabled}
          />
        </View>
      </ScrollView>
    );
  }
}

export default InstallationSummaryScreen;
