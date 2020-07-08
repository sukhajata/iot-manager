import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/fields";

const WhiteButton = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={disabled ? styles.buttonDisabled : styles.whiteButton}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonTextClear}>{title}</Text>
  </TouchableOpacity>
);

WhiteButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

WhiteButton.defaultProps = {
  disabled: false
};

export default WhiteButton;
