import React from "react";
import { View, Text, ScrollView } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Fab, Icon } from "native-base";

import { colors } from "../../styles/fields";
import DeviceCardItem from "../../components/DeviceCardItem";
import { getPhases } from "../../scripts/deviceSummaryService";
import routes from "../../routes";
import NiceButton from "../../components/NiceButton";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import HomeButton from "../../components/HomeButton";
import styles from "../../styles/fields";
import SiteInfoView from "../../components/SiteInfoView";

class InstallHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: false,
      siteInfo: null,
      submitDisabled: true
    };
  }

  componentDidMount = async () => {
    this._reload();
  };

  _reload() {
    let complete = true;
    const { currentSite } = this.props.siteContext;
    currentSite.Enclosures.forEach(enclosure => {
      enclosure.DetailsOfInstalls.forEach(detailsOfInstall => {
        if (
          !detailsOfInstall.Device ||
          detailsOfInstall.Device.SerialNumber === 0
        ) {
          complete = false;
        }
      });
    });
    currentSite.DetailsOfInstalls.forEach(detailsOfInstall => {
      if (
        !detailsOfInstall.Device ||
        detailsOfInstall.Device.SerialNumber === 0
      ) {
        complete = false;
      }
    });
    this.setState({
      submitDisabled: !complete
    });
  }

  _onSelectDevice(enclosure, detailsOfInstall) {
    this.props.navigation.navigate(routes.SCANNING_SCREEN, {
      enclosureId: enclosure ? enclosure.Id : null,
      deviceId: detailsOfInstall.Id
    });
  }

  _editSite() {
    this.props.navigation.navigate(routes.EDIT_SITE_SCREEN, { edit: 1 });
  }

  _startTesting() {
    this.props.navigation.navigate(routes.DEVICE_TEST_SCREEN);
  }

  render() {
    const { submitDisabled } = this.state;
    const { currentSite } = this.props.siteContext;
    return (
      <ScrollView style={{ margin: 10 }}>
        <NavigationEvents onDidFocus={() => this._reload()} />
        {currentSite && currentSite.Enclosures && (
          <>
            <SiteInfoView siteInfo={currentSite} />
            <Fab
              active={this.state.active}
              containerStyle={{}}
              style={{ backgroundColor: "#5067FF" }}
              position="topRight"
              onPress={() => this._editSite()}
            >
              <Icon name="ios-create" />
            </Fab>
            {submitDisabled && (
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                Tap to select a device
              </Text>
            )}
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
            <NiceButton
              title="Start testing"
              onPress={() => this._startTesting()}
              disabled={submitDisabled}
            />
          </>
        )}
      </ScrollView>
    );
  }
}

const Wrapped = withCurrentSite(InstallHomeScreen);
Wrapped.navigationOptions = ({ navigation }) => ({
  title: "Assign Devices"
});
export default Wrapped;
