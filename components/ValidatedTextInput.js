import React from "react";
import { View, TextInput, Text } from "react-native";
import PropTypes from "prop-types";

import styles from "../styles/fields";

const ValidatedTextInput = ({ error, value, onChangeText }) => (
  <View style={{ marginBottom: 15 }}>
    <TextInput
      style={error ? styles.errorTextInput : styles.validatedTextInput}
      value={value}
      onChangeText={onChangeText}
    />
    {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
  </View>
);

ValidatedTextInput.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired
};

export default ValidatedTextInput;
