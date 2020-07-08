import React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { MapView } from "expo";
import { Ionicons } from "@expo/vector-icons";

import routes from "../../routes";
import styles from "../../styles/fields";
import ValidatedTextInput from "../../components/ValidatedTextInput";
import {
  getIdentifierLabel,
  geoCodeAsync,
  getAddress,
  getPhases
} from "../../scripts/deviceSummaryService";
import { Site } from "../../scripts/DeploymentData";
import Skeleton from "../../components/Skeleton";
import Loading from "../../components/Loading";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import { setSite } from "../../scripts/storageService";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import NiceButton from "../../components/NiceButton";
import DeviceCardItem from "../../components/DeviceCardItem";

/**
 * Attempts to load info for a device using a provided serial number, renders a basic summary for the device.
 */
class EditSiteScreen extends React.Component {
  state = {
    errorMessage: null,
    identifier: "",
    errors: {
      identifier: null
    },
    latitude: null,
    longitude: null,
    submitDisabled: false,
    installationType: 0,
    identifierLabel: null,
    typingTimeout: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  async componentDidMount() {
    const { edit } = this.props.navigation.state.params;
    if (edit && edit == 1) {
      const { currentSite } = this.props.siteContext;
      if (currentSite) {
        const identifierLabel = getIdentifierLabel(
          parseInt(currentSite.InstallType)
        );
        this.setState({
          identifier: currentSite.InstallIdentifier,
          installationType: currentSite.InstallType,
          streetAddress1: currentSite.Location.AddressLine1,
          streetAddress2: currentSite.Location.AddressLine2,
          town: currentSite.Location.City,
          latitude: parseFloat(currentSite.Location.Latitude),
          longitude: parseFloat(currentSite.Location.Longitude),
          identifierLabel
        });
      } else {
        this.props.navigation.navigate(routes.HOME_SCREEN);
      }
    } else {
      const installationType = Site.InstallType;
      const identifierLabel = getIdentifierLabel(installationType);
      this.setState({ installationType, identifierLabel });
      const result = await geoCodeAsync("New Zealand");
      if (result) {
        this.setState({
          latitude: result.latitude,
          longitude: result.longitude
        });
      }
    }
  }

  _validateFields() {
    let identifierValid = true;

    const { identifier, installationType } = this.state;

    if (installationType < 2 || installationType > 3) {
      if (identifier.length < 2) {
        identifierValid = false;
      }
    }

    this.setState({
      errors: {
        identifier: identifierValid ? null : "Please enter a valid identifier"
      }
    });

    const valid = identifierValid;
    return valid;
  }

  _onChange = async (name, value) => {
    this.setState({
      [name]: value,
      errors: {
        //reset errors after a change
        identifier: null
      },
      errorMessage: null
    });
  };

  _onMapPress = async event => {
    const { latitude, longitude } = event.coordinate;

    this.setState({
      latitude,
      longitude
    });
  };

  _onSelectDevice(enclosure, device) {
    let params = {
      deviceId: device.Id ? device.Id : device.LocalId
    };
    if (enclosure) {
      params.enclosureId = enclosure.Id ? enclosure.Id : enclosure.LocalId;
    }
    this.props.navigation.navigate(routes.DEVICE_ADDRESS_SCREEN, params);
  }

  _addDeviceToEnclosure(enclosure) {
    const deviceId = this.props.siteContext.addDeviceToEnclosure(enclosure);

    this.props.navigation.navigate(routes.DEVICE_ADDRESS_SCREEN, {
      enclosureId:
        enclosure.Id && enclosure.Id !== 0 ? enclosure.Id : enclosure.LocalId,
      deviceId
    });
  }

  _addDeviceToSite() {
    const deviceId = this.props.siteContext.addDeviceToSite();

    this.props.navigation.navigate(routes.DEVICE_ADDRESS_SCREEN, {
      deviceId
    });
  }

  async _saveSite() {
    await this._save();
    this.props.navigation.navigate(routes.HOME_SCREEN);
  }

  async _startInstallation() {
    await this._save();
    const { siteId } = this.props.navigation.state.params;
    this.props.navigation.navigate(routes.INSTALL_HOME_SCREEN, { siteId });
  }

  async _save() {
    this.setState({ submitDisabled: true });
    await this.props.siteContext.save();
    this.setState({ submitDisabled: false });
  }

  async _handleSubmit() {
    if (this._validateFields()) {
      this.setState({ submitDisabled: true });
      const {
        installationType,
        identifier,
        streetAddress1,
        streetAddress2,
        town,
        latitude,
        longitude
      } = this.state;

      if (installationType < 2 || installationType > 3) {
        Site.InstallIdentifier = identifier;
      }
      Site.Location.AddressLine1 = streetAddress1;
      Site.Location.AddressLine2 = streetAddress2;
      Site.Location.City = town;
      Site.Location.Latitude = latitude;
      Site.Location.Longitude = longitude;

      //persist
      const { edit } = this.props.navigation.state.params;

      try {
        if (edit && edit == 1) {
          const {
            updateSiteDetails,
            save,
            currentSite
          } = this.props.siteContext;
          Site.InstallType = currentSite.InstallType;
          updateSiteDetails(Site);
          await save();
          this.props.navigation.navigate(routes.INSTALL_HOME_SCREEN, {
            siteId: currentSite.Id
          });
        } else {
          let createdSite = await DeploymentDatabaseAPI.CreateSite(Site);
          await setSite(createdSite);
          this.props.navigation.navigate(routes.INSTALL_HOME_SCREEN, {
            siteId: createdSite.Id
          });
        }
      } catch (error) {
        console.log(error);
        this.setState({
          submitDisabled: false,
          errorMessage: JSON.stringify(error)
        });
      }
    }
  }

  render() {
    const {
      errorMessage,
      errors,
      submitDisabled,
      identifier,
      identifierLabel,
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    } = this.state;
    const {
      currentSite,
      contextError,
      loadSite,
      addEnclosure,
      removeEnclosure
    } = this.props.siteContext;
    return (
      <Skeleton
        handleSubmit={() => this._handleSubmit()}
        submitDisabled={submitDisabled}
      >
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {identifierLabel && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{identifierLabel}*</Text>
            <TextInput
              style={{
                flex: 2,
                marginLeft: 5,
                padding: 10,
                borderWidth: 1
              }}
              value={identifier}
              error={errors.identifier}
              onChangeText={text => this._onChange("identifier", text)}
            />
          </View>
        )}
        {latitude && longitude ? (
          <MapView
            style={{
              width: "80%",
              height: 300,
              marginTop: 15,
              marginBottom: 15
            }}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta
            }}
            onPress={({ nativeEvent }) => this._onMapPress(nativeEvent)}
          >
            <MapView.Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude
              }}
            />
          </MapView>
        ) : (
          <Loading />
        )}
        {currentSite && (
          <>
            {currentSite.Enclosures.map((enclosure, i) => (
              <View key={i} style={styles.enclosure}>
                {enclosure.DetailsOfInstalls &&
                  enclosure.DetailsOfInstalls.map((detailsOfInstall, j) => (
                    <DeviceCardItem
                      key={j}
                      icp={detailsOfInstall.ICPNumber}
                      phase={getPhases(
                        detailsOfInstall.MeteringRed,
                        detailsOfInstall.MeteringWhite,
                        detailsOfInstall.MeteringBlue
                      )}
                      serialNumber={
                        detailsOfInstall.Device
                          ? detailsOfInstall.Device.SerialNumber
                          : 0
                      }
                      premise={
                        detailsOfInstall.MeteredPremiseLocation.AddressLine1
                      }
                      onSelect={() =>
                        this._onSelectDevice(enclosure, detailsOfInstall)
                      }
                    />
                  ))}
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.addDeviceToEnclosure}
                    onPress={() => this._addDeviceToEnclosure(enclosure)}
                  >
                    <Ionicons
                      name="ios-add-circle-outline"
                      size={48}
                      color="black"
                      style={{ marginRight: 10, marginLeft: 5 }}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text>Add Device To</Text>
                      <Text>Enclosure</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeEnclosure}
                    onPress={() => removeEnclosure(enclosure)}
                  >
                    <Ionicons
                      name="ios-remove-circle-outline"
                      size={48}
                      color="black"
                      style={{ marginRight: 10, marginLeft: 5 }}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text>Remove</Text>
                      <Text>Enclosure</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {currentSite.DetailsOfInstalls &&
              currentSite.DetailsOfInstalls.map((detailsOfInstall, j) => (
                <DeviceCardItem
                  key={j}
                  icp={detailsOfInstall.ICPNumber}
                  phase={getPhases(
                    detailsOfInstall.MeteringRed,
                    detailsOfInstall.MeteringWhite,
                    detailsOfInstall.MeteringBlue
                  )}
                  serialNumber={
                    detailsOfInstall.Device
                      ? detailsOfInstall.Device.SerialNumber
                      : 0
                  }
                  premise={detailsOfInstall.MeteredPremiseLocation.AddressLine1}
                  onSelect={() => this._onSelectDevice(null, detailsOfInstall)}
                />
              ))}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.addDeviceToSite}
                onPress={() => this._addDeviceToSite()}
              >
                <Ionicons
                  name="ios-add-circle-outline"
                  size={48}
                  color="black"
                  style={{ marginRight: 10, marginLeft: 5 }}
                />
                <Text>Add Device</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addEnclosure}
                onPress={() => addEnclosure()}
              >
                <Ionicons
                  name="ios-add-circle-outline"
                  size={48}
                  color="black"
                  style={{ marginRight: 10, marginLeft: 5 }}
                />
                <Text>Add Enclosure</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Skeleton>
    );
  }
}

const Wrapped = withCurrentSite(EditSiteScreen);
Wrapped.navigationOptions = {
  title: "Edit Site"
};
export default Wrapped;
