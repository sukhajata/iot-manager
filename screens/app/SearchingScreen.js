import React from "react";
import { View, TextInput, Text } from "react-native";
//import { Content, Text } from "native-base";

import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import NiceButton from "../../components/NiceButton";
import styles from "../../styles/fields";
import { deviceStateToString } from "../../scripts/deviceSummaryService";
import routes from "../../routes";
import DeviceCard from "../../components/DeviceCard";
import Loading from "../../components/Loading";
import { withCurrentSite } from "../../context/CurrentSiteContext";

class SearchingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceInfo: null,
      serialNumber: "",
      errorMessage: null,
      submitDisabled: false,
      loading: false
    };
  }

  componentDidMount() {
    const serialNumber = this.props.navigation.getParam("serialNumber", null);
    if (serialNumber) {
      this._loadDeviceInfo(serialNumber);
      this.setState({ serialNumber });
    }
  }

  _search = async () => {
    const { serialNumber } = this.state;
    if (serialNumber.length != 8) {
      this.setState({ errorMessage: "Invalid serial number" });
    } else {
      try {
        const parsed = parseInt(serialNumber);
        if (parsed == NaN) {
          throw new TypeError("Invalid serial number");
        }

        //start processing
        this.setState({ submitDisabled: true, errorMessage: null });
        await this._loadDeviceInfo(parsed);
      } catch (error) {
        this.setState({ errorMessage: error.message });
        console.log(error);
      }
    }
  };

  async _loadDeviceInfo(serialNumber) {
    try {
      this.setState({
        submitDisabled: true,
        loading: true,
        deviceInfo: null
      });
      const result = await DeploymentDatabaseAPI.GetDeviceBySerialNumber(
        parseInt(serialNumber)
      );
      //console.log(result);
      if (result) {
        this.setState({
          deviceInfo: result,
          submitDisabled: false,
          loading: false
        });

        /*for (let key in result) {
          DeviceInfo[key] = result[key];
        }
        InstallationDeployment.DeviceFK = DeviceInfo.Id;*/
      } else {
        this.setState({ errorMessage: "Device not found." });
        console.log(`Device ${serialNumber} does not exist in database!`);
      }
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        loading: false,
        submitDisabled: false
      });
      console.log(`Device ${serialNumber} does not exist in database!`);
    }
  }

  _onSelectDevice = async () => {
    //update data
    this.setState({ loading: true });
    const { enclosureId, deviceId } = this.props.navigation.state.params;
    const { deviceInfo } = this.state;

    const { getDevice, updateDevice, save } = this.props.siteContext;
    console.log(`Enclosure id ${enclosureId}, device id ${deviceId}`);
    let detailsOfInstall = getDevice(enclosureId, deviceId);
    detailsOfInstall.DeviceFK = deviceInfo.Id;
    //detailsOfInstall.SerialNumber = deviceInfo.SerialNumber;
    //detailsOfInstall.Device = deviceInfo;
    updateDevice(detailsOfInstall);
    await save();

    this.props.navigation.navigate(routes.INSTALL_HOME_SCREEN);
  };

  render() {
    const { errorMessage, deviceInfo, serialNumber, loading } = this.state;
    return (
      <View style={{ margin: 10 }}>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <Text>Serial number</Text>
        <TextInput
          value={serialNumber}
          style={styles.textInput}
          onChangeText={text => this.setState({ serialNumber: text })}
        />
        <NiceButton
          title="Search"
          style={{ width: "90%" }}
          onPress={this._search}
        />
        <View>
          {loading && <Loading />}
          {!loading && deviceInfo && (
            <DeviceCard
              serialNumber={deviceInfo.SerialNumber}
              productName={deviceInfo.ProductName}
              deviceState={deviceStateToString(deviceInfo.DeviceState)}
              onSelect={() => this._onSelectDevice(deviceInfo.SerialNumber)}
            />
          )}
        </View>
      </View>
    );
  }
}

const Wrapped = withCurrentSite(SearchingScreen);
Wrapped.navigationOptions = {
  title: "Search for Device"
};
export default Wrapped;
