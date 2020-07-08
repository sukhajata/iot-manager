import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";

const DeleteButton = ({ onPress, disabled }) => (
  <Button style={styles.button} onPress={onPress} disabled={disabled}>
    <Text style={styles.buttonText}>Delete</Text>
  </Button>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold"
  }
});

DeleteButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

DeleteButton.defaultProps = {
  disabled: false
};

export default DeleteButton;
