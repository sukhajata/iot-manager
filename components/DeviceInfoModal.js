import React from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";
import DeviceInfoView from "./DeviceInfoView";
import NiceButton from "./NiceButton";
import { DEPLOYMENT_STATES } from "../scripts/deviceSummaryService";

const DeviceInfoModal = ({ installation, modalVisible, next, hideModal }) => (
  <Modal animationType="slide" transparent={false} visible={modalVisible}>
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        margin: 15,
        marginTop: 30
      }}
    >
      <DeviceInfoView
        installationDeployment={installation}
        deviceInfo={installation.Device}
        premiseLocation={installation.PremiseLocation}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <NiceButton title="Back" onPress={hideModal} />
        {installation.DeploymentState === DEPLOYMENT_STATES.READY && (
          <NiceButton title="Start tests" onPress={next} />
        )}
      </View>
    </View>
  </Modal>
);

DeviceInfoModal.propTypes = {
  installation: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default DeviceInfoModal;
