import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

const SignalMeter = ({ strength }) => {
  function barStyle(bar) {
    return {
      borderRadius: 2,
      width: "20%",
      height: `${25 * bar}%`,
      backgroundColor: strength >= 25 * (bar - 1) + 10 ? "green" : "lightgrey"
    };
  }

  return (
    <View style={styles.containerStyle}>
      <View style={barStyle(1)} />
      <View style={barStyle(2)} />
      <View style={barStyle(3)} />
      <View style={barStyle(4)} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 100,
    height: 100,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderRadius: 2,
    backgroundColor: "#eeeeee"
  }
});

SignalMeter.propTypes = {
  strength: PropTypes.number.isRequired
};

export default SignalMeter;
