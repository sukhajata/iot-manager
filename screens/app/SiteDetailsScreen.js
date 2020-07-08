import React from "react";
import { Text } from "react-native";

import routes from "../../routes";
import styles from "../../styles/fields";
import ValidatedTextInput from "../../components/ValidatedTextInput";
import {
  getIdentifierLabel,
  geoCodeAsync,
  getAddress
} from "../../scripts/deviceSummaryService";
import { Site } from "../../scripts/DeploymentData";
import Skeleton from "../../components/Skeleton";
import NiceMap from "../../components/NiceMap";
import Loading from "../../components/Loading";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import { setSite } from "../../scripts/storageService";
import { withCurrentSite } from "../../context/CurrentSiteContext";

/**
 * Attempts to load info for a device using a provided serial number, renders a basic summary for the device.
 */
class SiteDetailsScreen extends React.Component {
  state = {
    errorMessage: null,
    identifier: "",
    streetAddress1: "",
    streetAddress2: "",
    town: "",
    errors: {
      identifier: null,
      streetAddress1: null,
      town: null
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
    let streetAddressValid = true;
    let townValid = true;
    const { identifier, installationType, streetAddress1, town } = this.state;

    if (installationType < 2 || installationType > 3) {
      if (identifier.length < 2) {
        identifierValid = false;
      }
    }

    if (streetAddress1.length < 3) {
      streetAddressValid = false;
    }

    if (town.length < 3) {
      townValid = false;
    }

    this.setState({
      errors: {
        identifier: identifierValid ? null : "Please enter a valid identifier",
        streetAddress1: streetAddressValid
          ? null
          : "Please enter a valid street address",
        town: townValid ? null : "Please enter a valid town"
      }
    });

    const valid = identifierValid && streetAddressValid && townValid;
    return valid;
  }

  _onChange = async (name, value) => {
    this.setState({
      [name]: value,
      errors: {
        //reset errors after a change
        identifier: null,
        streetAddress1: null,
        town: null
      },
      errorMessage: null
    });

    if (name !== "identifier") {
      const { typingTimeout } = this.state;

      //wait for typing to stop then fetch location data
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      this.setState({
        typingTimeout: setTimeout(() => this._getGeoCode(), 500)
      });
    }
  };

  _getGeoCode = async () => {
    const { streetAddress1, streetAddress2, town } = this.state;
    if (streetAddress1.length > 4 || town.length > 3) {
      this.setState({ latitude: null, longitude: null });
      const address =
        streetAddress1 + " " + streetAddress2 + " " + town + " New Zealand";
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

  _onMapPress = async event => {
    const { latitude, longitude } = event.coordinate;
    const address = await getAddress({ latitude, longitude });

    this.setState({
      latitude,
      longitude,
      streetAddress1: address[0].name,
      town: address[0].city
    });
  };

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
          this.props.navigation.navigate(routes.SITE_SUMMARY_SCREEN, {
            siteId: currentSite.Id
          });
        } else {
          let createdSite = await DeploymentDatabaseAPI.CreateSite(Site);
          await setSite(createdSite);
          this.props.navigation.navigate(routes.SITE_SUMMARY_SCREEN, {
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
      streetAddress1,
      streetAddress2,
      town,
      latitudeDelta,
      longitudeDelta
    } = this.state;

    return (
      <Skeleton
        handleSubmit={() => this._handleSubmit()}
        submitDisabled={submitDisabled}
      >
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {identifierLabel && (
          <>
            <Text>{identifierLabel}*</Text>
            <ValidatedTextInput
              value={identifier}
              error={errors.identifier}
              onChangeText={text => this._onChange("identifier", text)}
            />
          </>
        )}
        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
          Where will the equipment be installed?
        </Text>
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
      </Skeleton>
    );
  }
}

const Wrapped = withCurrentSite(SiteDetailsScreen);
Wrapped.navigationOptions = {
  title: "Site Details"
};
export default Wrapped;
