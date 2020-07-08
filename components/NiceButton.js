import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/fields";

const NiceButton = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={disabled ? styles.buttonDisabled : styles.navigationButton}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

NiceButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

NiceButton.defaultProps = {
  disabled: false
};

export default NiceButton;
