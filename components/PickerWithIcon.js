import React from "react";
import { Icon, Picker } from "native-base";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

import styles from "../styles/fields";

const PickerWithIcon = ({ onValueChange, selected, options, title, error }) => (
  <View style={error ? { marginBottom: 0 } : { marginBottom: 15 }}>
    <View style={styles.pickerContainer}>
      <Picker
        mode="dropdown"
        iosHeader={title}
        iosIcon={<Icon name="arrow-down" />}
        style={{ width: undefined }}
        selectedValue={selected}
        onValueChange={onValueChange}
      >
        {options.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

PickerWithIcon.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  selected: PropTypes.number,
  options: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  error: PropTypes.string
};

export default PickerWithIcon;
