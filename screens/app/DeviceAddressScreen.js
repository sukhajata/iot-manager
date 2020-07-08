import React from "react";
import { Text, ScrollView, View } from "react-native";
import { NavigationEvents } from "react-navigation";

import { getAddress, geoCodeAsync } from "../../scripts/deviceSummaryService";
import styles from "../../styles/fields";
import routes from "../../routes";
import KeyboardAvoider from "../../components/KeyboardAvoider";
//import { Site, getDevice } from "../../scripts/DeploymentData";
import NiceMap from "../../components/NiceMap";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import FlexButton from "../../components/FlexButton";
import DeleteButton from "../../components/DeleteButton";

/**
 * Attempts to load info for a device using a provided serial number, renders a basic summary for the device.
 */
class DeviceAddressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      submitDisabled: false,
      streetAddress1: "",
      streetAddress2: "",
      latitude: null,
      longitude: null,
      latitudeDelta: 2,
      longitudeDelta: 2,
      town: "",
      country: "",
      typingTimeout: 0,
      errors: {
        streetAddress1: null,
        town: null
      }
    };
  }

  async componentDidMount() {
    const { getParam } = this.props.navigation;
    const deviceId = getParam("deviceId");
    const enclosureId = getParam("enclosureId", null);

    const { getDevice, currentSite } = this.props.siteContext;
    const detailsOfInstall = getDevice(enclosureId, deviceId);
    //console.log(detailsOfInstall);
    if (
      detailsOfInstall.MeteredPremiseLocation.AddressLine1.length > 2 &&
      detailsOfInstall.MeteredPremiseLocation.City.length > 2
    ) {
      this.setState({
        streetAddress1: detailsOfInstall.MeteredPremiseLocation.AddressLine1,
        town: detailsOfInstall.MeteredPremiseLocation.City,
        latitude: parseFloat(detailsOfInstall.MeteredPremiseLocation.Latitude),
        longitude: parseFloat(detailsOfInstall.MeteredPremiseLocation.Longitude)
      });
    } else if (
      currentSite.Location.Latitude != 0 &&
      currentSite.Location.Longitude != 0
    ) {
      const lat = parseFloat(currentSite.Location.Latitude);
      const lng = parseFloat(currentSite.Location.Longitude);
      this.setState({
        latitude: lat,
        longitude: lng,
        streetAddress1: currentSite.Location.AddressLine1,
        town: currentSite.Location.City
      });
      /*
      const addresses = await getAddress({
        latitude: lat,
        longitude: lng
      });
      if (addresses && addresses[0] && addresses[0].city) {
        this.setState({
          town: addresses[0].city,
          country: addresses[0].country
        });
      }
      */
    }
  }

  _onChange = async (name, text) => {
    this.setState({
      [name]: text,
      errors: {
        streetAddress1: null,
        town: null
      },
      errorMessage: null
    });

    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    this.setState({
      typingTimeout: setTimeout(() => this._getGeoCode(), 500)
    });
  };

  _getGeoCode = async () => {
    const { streetAddress1, streetAddress2, town, country } = this.state;
    if (streetAddress1.length > 4 && town.length > 3) {
      this.setState({ latitude: null, longitude: null });
      const address =
        streetAddress1 + " " + streetAddress2 + " " + town + " " + country;
      const result = await geoCodeAsync(address);
      //console.log(result);
      if (result) {
        this.setState({
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      } else {
        this.setState({
          errorMessage: "Address not found"
        });
      }
    }
  };

  _validateFields() {
    const { streetAddress1, town } = this.state;
    let valid = false;
    if (streetAddress1.length > 2 && town.length > 2) {
      valid = true;
    }
    this.setState({
      errors: {
        streetAddress1:
          streetAddress1.length < 2 ? "Please enter a street address" : null,
        town: town.length < 2 ? "Please enter a town" : null
      }
    });

    return valid;
  }

  _onMapPress = async event => {
    const { latitude, longitude } = event.coordinate;
    const address = await getAddress({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    this.setState({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      streetAddress1: address[0].name,
      town: address[0].city
    });
  };

  async _delete() {
    const { enclosureId, deviceId } = this.props.navigation.state.params;
    this.props.siteContext.removeDevice(enclosureId, deviceId);
    this.props.navigation.navigate(routes.SITE_SUMMARY_SCREEN);
  }

  async _handleSubmit() {
    if (this._validateFields()) {
      this.setState({
        submitDisabled: true
      });
      const {
        streetAddress1,
        streetAddress2,
        town,
        country,
        latitude,
        longitude
      } = this.state;
      const { enclosureId, deviceId } = this.props.navigation.state.params;
      const { getDevice, updateDevice } = this.props.siteContext;
      let detailsOfInstall = getDevice(enclosureId, deviceId);

      detailsOfInstall.MeteredPremiseLocation.AddressLine1 = streetAddress1;
      detailsOfInstall.MeteredPremiseLocation.AddressLine2 = streetAddress2;
      detailsOfInstall.MeteredPremiseLocation.City = town;
      detailsOfInstall.MeteredPremiseLocation.Country = country;
      detailsOfInstall.MeteredPremiseLocation.Latitude = latitude;
      detailsOfInstall.MeteredPremiseLocation.Longitude = longitude;
      updateDevice(enclosureId, detailsOfInstall);

      this.props.navigation.navigate(routes.DEVICE_DETAILS_SCREEN, {
        enclosureId,
        deviceId
      });
    }
  }

  render() {
    const {
      errors,
      errorMessage,
      latitude,
      longitude,
      submitDisabled,
      streetAddress1,
      streetAddress2,
      town,
      latitudeDelta,
      longitudeDelta
    } = this.state;

    return (
      <KeyboardAvoider>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{ margin: 10, width: "90%", flex: 1 }}
          contentContainerStyle={{
            justifyContent: "space-between"
          }}
        >
          <NavigationEvents
            onDidFocus={() => {
              this.setState({ submitDisabled: false });
            }}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <NiceMap
            onMapPress={this._onMapPress}
            onChange={this._onChange}
            latitude={latitude}
            longitude={longitude}
            latitudeDelta={latitudeDelta}
            longitudeDelta={longitudeDelta}
            streetAddress1={streetAddress1}
            streetAddress2={streetAddress2}
            town={town}
            errors={errors}
          />
          <View style={{ flexDirection: "row" }}>
            <DeleteButton onPress={() => this._delete()} />
            <FlexButton
              title="Continue"
              onPress={() => this._handleSubmit()}
              submitDisabled={submitDisabled}
            />
          </View>
        </ScrollView>
      </KeyboardAvoider>
    );
  }
}

const Wrapped = withCurrentSite(DeviceAddressScreen);
Wrapped.navigationOptions = {
  title: "Monitored Premise Location"
};
export default Wrapped;
