import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const RadioGroup = ({ options, selected, onValueChange }) => (
  <>
    {options.map(option => (
      <TouchableOpacity
        key={option.value}
        onPress={() => onValueChange(option.value)}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#000",
              alignItems: "center",
              justifyContent: "center",
              margin: 10
            }}
          >
            {option.value === selected && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: "#000"
                }}
              />
            )}
          </View>
          <Text style={{ marginTop: 12 }}>{option.label}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </>
);

RadioGroup.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.number,
  onValueChange: PropTypes.func.isRequired
};

export default RadioGroup;
