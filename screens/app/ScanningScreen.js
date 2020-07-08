import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Permissions, BarCodeScanner } from "expo";

import { Spacing } from "../../styles";
import WhiteButton from "../../components/WhiteButton";
import routes from "../../routes";
import { withCurrentSite } from "../../context/CurrentSiteContext";

class ScanningScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      detailsOfInstall: null,
      errorMessage: null
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission denied to access camera."
      });
    }
    const { enclosureId, deviceId } = this.props.navigation.state.params;
    //const enclosure = getEnclosure(enclosureId);
    const detailsOfInstall = this.props.siteContext.getDevice(
      enclosureId,
      deviceId
    );
    this.setState({
      hasCameraPermission: status === "granted",
      detailsOfInstall
    });
    //this._handleBarCodeScanned({ data: "18470081" });
  }

  _handleBarCodeScanned(code) {
    if (!this.state.scanned) {
      const matches = code.data.match(/^[0-9]{8}$/);
      if (matches && matches.length >= 1) {
        console.debug(
          `Code with type ${code.type} and data ${code.data} has been scanned!`
        );
        this.setState({ scanned: true });
        const serialNumber = matches[0];
        const { enclosureId, deviceId } = this.props.navigation.state.params;
        this.props.navigation.navigate(routes.SEARCHING_SCREEN, {
          serialNumber,
          enclosureId,
          deviceId
        });
      }
    }
  }

  _manualSearch() {
    const { enclosureId, deviceId } = this.props.navigation.state.params;
    this.props.navigation.navigate(routes.SEARCHING_SCREEN, {
      enclosureId,
      deviceId
    });
  }

  render() {
    const screenWidth = Dimensions.get("window").width;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "black"
        }}
      >
        <NavigationEvents
          onDidFocus={() => {
            //When users navigate back to this screen, 'scanned' needs to be reset
            this.setState({ scanned: false });
          }}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              width: screenWidth * 0.8,
              height: screenWidth * 0.8,
              marginTop: 30
            }}
          >
            <BarCodeScanner
              onBarCodeScanned={barcode => this._handleBarCodeScanned(barcode)}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <Text style={styles.instructions}>
            Line up the QR code or barcode
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white"
          }}
        >
          <WhiteButton
            title="Enter serial number"
            onPress={() => this._manualSearch()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredFlex: {
    ...Spacing.centeredFlex
  },
  bottomView: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: "#C8C8C8"
  },
  textContainer: {
    flex: 3,
    alignContent: "flex-start",
    justifyContent: "center",
    marginLeft: 20
  },
  instructions: {
    color: "white",
    paddingTop: 20,
    paddingBottom: 20
  }
});

const Wrapped = withCurrentSite(ScanningScreen);
Wrapped.navigationOptions = {
  title: "Code reader"
};
export default Wrapped;
