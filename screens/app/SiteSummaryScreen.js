import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import SiteInfoView from "../../components/SiteInfoView";
import { colors } from "../../styles/fields";
import DeviceCardItem from "../../components/DeviceCardItem";
import { getPhases } from "../../scripts/deviceSummaryService";
import routes from "../../routes";
import NiceButton from "../../components/NiceButton";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import Loading from "../../components/Loading";
import HomeButton from "../../components/HomeButton";
import styles from "../../styles/fields";

class SiteSummaryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: false,
      submitDisabled: false
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const { siteId } = this.props.navigation.state.params;
    await this.props.siteContext.loadSite(siteId);
    console.log(this.props.siteContext.currentSite);
    this.setState({ loading: false });
  }

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

  render() {
    const {
      currentSite,
      contextError,
      loadSite,
      addEnclosure,
      removeEnclosure
    } = this.props.siteContext;
    const { loading } = this.state;
    return (
      <ScrollView style={{ margin: 10 }}>
        {contextError && <Text>{contextError}</Text>}
        <NavigationEvents
          onDidFocus={async () => {
            const { siteId } = this.props.navigation.state.params;
            await loadSite(siteId);
          }}
        />
        {loading && (
          <View style={{ padding: 50 }}>
            <Loading />
          </View>
        )}
        {currentSite && (
          <>
            <SiteInfoView siteInfo={currentSite} />
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
                    <Text>Remove Enclosure</Text>
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
            <NiceButton
              title="Testing"
              onPress={() => this._startInstallation()}
              disabled={this.state.submitDisabled}
            />
          </>
        )}
      </ScrollView>
    );
  }
}

const Wrapped = withCurrentSite(SiteSummaryScreen);
Wrapped.navigationOptions = ({ navigation }) => ({
  title: "Site Plan",
  headerRight: <HomeButton navigation={navigation} />
});
export default Wrapped;
