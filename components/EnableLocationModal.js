import React from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";

const EnableLocationModal = ({ modalVisible, hideModal }) => (
  <Modal animationType="slide" transparent={false} visible={modalVisible}>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={styles.header}>App does not have access to location!</Text>
      <View style={styles.row}>
        <Image
          source={require("../assets/settings.png")}
          style={styles.image}
        />
        <Text style={styles.message}>Open settings</Text>
      </View>
      <View style={styles.row}>
        <Image source={require("../assets/privacy.png")} style={styles.image} />
        <Text style={styles.message}>Select privacy</Text>
      </View>
      <View style={styles.row}>
        <Image
          source={require("../assets/location.png")}
          style={styles.image}
        />
        <Text style={styles.message}>Make sure location services is on</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            width: 280,
            padding: 10,
            backgroundColor: colors.indigo
          }}
          onPress={hideModal}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

EnableLocationModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired
};

const styles = {
  header: {
    fontSize: 24,
    width: 280,
    marginBottom: 15,
    textAlign: "center"
  },
  row: {
    width: 200,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  message: {
    fontSize: 20,
    width: 200
  }
};

export default EnableLocationModal;
