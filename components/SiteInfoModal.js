import React from "react";
import { Modal, View } from "react-native";
import PropTypes from "prop-types";
import { MapView } from "expo";

import SiteInfoView from "./SiteInfoView";
import { geoCodeAsync } from "../scripts/deviceSummaryService";
import NiceButton from "./NiceButton";
import { DEPLOYMENT_STATES } from "../scripts/deviceSummaryService";
import styles from "../styles/fields";
import Loading from "./Loading";

class SiteInfoModal extends React.Component {
  //constructor for testing
  constructor(props) {
    super(props);
    this.state = {
      locationModalVisible: false,
      errorMessage: null
    };
  }

  render() {
    const { siteInfo, modalVisible, next, hideModal } = this.props;
    const { locationModalVisible, errorMessage } = this.state;
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            margin: 15,
            marginTop: 30
          }}
        >
          <SiteInfoView siteInfo={siteInfo} />
          {siteInfo.Location.Latitude !== 0 &&
          siteInfo.Location.Longitude !== 0 ? (
            <MapView
              style={{
                width: "80%",
                height: 300,
                marginTop: 15,
                marginBottom: 15
              }}
              initialRegion={{
                latitude: siteInfo.Location.Latitude,
                longitude: siteInfo.Location.Longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: siteInfo.Location.Latitude,
                  longitude: siteInfo.Location.Longitude,
                  title: "Street address"
                }}
              />
            </MapView>
          ) : (
            <View style={styles.map}>
              <Loading />
            </View>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <NiceButton title="Back" onPress={hideModal} />
            {siteInfo.DeploymentState === DEPLOYMENT_STATES.READY && (
              <NiceButton title="Start tests" onPress={next} />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

SiteInfoModal.propTypes = {
  siteInfo: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default SiteInfoModal;
