import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";

const FlexButton = ({ onPress, title, disabled }) => (
  <Button style={styles.button} onPress={onPress} disabled={disabled}>
    <Text style={styles.buttonText}>{title}</Text>
  </Button>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: colors.indigo,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold"
  }
});

FlexButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

FlexButton.defaultProps = {
  disabled: false
};

export default FlexButton;
