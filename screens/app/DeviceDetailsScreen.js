import React from "react";
import { View, TextInput, Text } from "react-native";

import routes from "../../routes";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import styles from "../../styles/fields";
import ValidatedTextInput from "../../components/ValidatedTextInput";
import PickerWithIcon from "../../components/PickerWithIcon";
import {
  getCTRatios,
  getIdentifierLabel
} from "../../scripts/deviceSummaryService";
import Skeleton from "../../components/Skeleton";
import CheckButton from "../../components/CheckButton";
import { colors } from "../../styles/fields";
import { withCurrentSite } from "../../context/CurrentSiteContext";

/**
 * Attempts to load info for a device using a provided serial number, renders a basic summary for the device.
 */
class DeviceDetailsScreen extends React.Component {
  state = {
    errorMessage: null,
    icp: "",
    ctRatio: 0,
    phase_red: false,
    phase_white: false,
    phase_blue: false,
    phase_unknown: false,
    errors: {
      icp: null,
      ctRatio: null,
      phase: null
    },
    submitDisabled: false,
    installationType: 0
  };

  async componentDidMount() {
    const { currentSite, getDevice } = this.props.siteContext;
    const installationType = currentSite.InstallType;
    const { enclosureId, deviceId } = this.props.navigation.state.params;

    const device = getDevice(enclosureId, deviceId);
    //console.log(device);
    if (device && device.PrimaryCT) {
      this.setState({
        icp: device.ICPNumber,
        ctRatio: device.PrimaryCT,
        phase_blue: device.MeteringBlue,
        phase_red: device.MeteringRed,
        phase_white: device.MeteringWhite,
        phase_unknown: device.MeteringUnknown,
        installationType
      });
    } else {
      this.setState({ installationType });
    }
  }

  _validateFields() {
    let icpValid = true;
    let ctValid = true;
    let phaseValid = true;
    const {
      icp,
      ctRatio,
      installationType,
      phase_red,
      phase_white,
      phase_blue,
      phase_unknown
    } = this.state;

    if (installationType !== 4 && icp.length < 2) {
      icpValid = false;
    }

    if (ctRatio === 0) {
      ctValid = false;
    }

    if (!phase_red && !phase_white && !phase_blue && !phase_unknown) {
      phaseValid = false;
    }

    this.setState({
      errors: {
        icp: icpValid ? null : "Please enter a valid ICP",
        ctRatio: ctValid ? null : "Please select a CTRatio",
        phase: phaseValid ? null : "Please select a phase option"
      }
    });

    const valid = icpValid && ctValid && phaseValid;
    return valid;
  }

  _onChange = (name, value) => {
    this.setState({
      [name]: value,
      errors: {
        //reset errors after a change
        icp: null,
        ctRatio: null,
        phase: null
      }
    });
  };

  _handleSubmit = async () => {
    if (this._validateFields()) {
      this.setState({ submitDisabled: true });
      const {
        installationType,
        icp,
        ctRatio,
        phase_blue,
        phase_red,
        phase_white,
        phase_unknown
      } = this.state;
      const { getParam } = this.props.navigation;
      const enclosureId = getParam("enclosureId");
      const deviceId = getParam("deviceId");
      const { getDevice, updateDevice, save } = this.props.siteContext;
      const device = getDevice(enclosureId, deviceId);
      if (icp != "") {
        device.ICPNumber = icp;
      }

      device.PrimaryCT = ctRatio;
      device.MeteringRed = phase_red;
      device.MeteringBlue = phase_blue;
      device.MeteringWhite = phase_white;
      device.MeteringUnknown = phase_unknown;

      try {
        updateDevice(device);
        const site = await save();

        if (!site) {
          this.setState({ errorMessage: "Save failed", submitDisabled: false });
        } else {
          this.props.navigation.navigate(routes.EDIT_SITE_SCREEN, {
            siteId: site.Id
          });
        }
      } catch (error) {
        this.setState({
          errorMessage: JSON.stringify(error),
          submitDisabled: false
        });
      }
    }
  };

  render() {
    const {
      errorMessage,
      errors,
      submitDisabled,
      installationType,
      icp,
      ctRatio,
      phase_red,
      phase_white,
      phase_blue,
      phase_unknown
    } = this.state;

    return (
      <Skeleton
        handleSubmit={() => this._handleSubmit()}
        submitDisabled={submitDisabled}
      >
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
       
            <Text>ICP number</Text>
            <ValidatedTextInput
              value={icp}
              error={errors.icp}
              onChangeText={text => this._onChange("icp", text)}
            />
          
        
        <Text>Meter CT ratio</Text>
        <PickerWithIcon
          title="Meter CT ratio"
          error={errors.ctRatio}
          options={getCTRatios()}
          selected={ctRatio}
          onValueChange={itemValue => this._onChange("ctRatio", itemValue)}
        />
        <Text>Phase</Text>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={{ marginRight: 10 }}>
            <CheckButton
              checked={phase_red}
              onPress={() =>
                this.setState({
                  phase_red: !this.state.phase_red,
                  phase_unknown: false,
                  errors: {
                    ...errors,
                    phase: null
                  }
                })
              }
              title="Red"
              color={colors.red}
            />
          </View>
          <View style={{ marginRight: 10 }}>
            <CheckButton
              checked={phase_white}
              onPress={() =>
                this.setState({
                  phase_white: !this.state.phase_white,
                  phase_unknown: false,
                  errors: {
                    ...errors,
                    phase: null
                  }
                })
              }
              title="White"
              color={colors.white}
            />
          </View>
          <View style={{ marginRight: 10 }}>
            <CheckButton
              checked={phase_blue}
              onPress={() =>
                this.setState({
                  phase_blue: !this.state.phase_blue,
                  phase_unknown: false,
                  errors: {
                    ...errors,
                    phase: null
                  }
                })
              }
              title="Blue"
              color={colors.blue}
            />
          </View>
          <View>
            <CheckButton
              checked={phase_unknown}
              onPress={() =>
                this.setState({
                  phase_unknown: !this.state.phase_unknown,
                  phase_red: false,
                  phase_white: false,
                  phase_blue: false,
                  errors: {
                    ...errors,
                    phase: null
                  }
                })
              }
              title="Unknown"
              color={colors.black}
            />
          </View>
        </View>
        <Text style={styles.errorText}>{errors.phase}</Text>
      </Skeleton>
    );
  }
}

const Wrapped = withCurrentSite(DeviceDetailsScreen);
Wrapped.navigationOptions = {
  title: "Device Details"
};
export default Wrapped;
