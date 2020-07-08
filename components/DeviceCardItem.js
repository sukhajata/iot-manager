import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../styles/fields";

const DeviceCardItem = ({ icp, phase, premise, onSelect, serialNumber }) => (
  <TouchableOpacity
    onPress={onSelect}
    style={{
      backgroundColor: colors.paleYellow,
      padding: 10,
      marginBottom: 10,
      marginRight: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      shadowOffset: { width: 2, height: 2 },
      shadowColor: "black",
      shadowOpacity: 1
    }}
  >
    <View style={{ flex: 3 }}>
      <Text>{`ICP: ${icp}`}</Text>
      <Text>{`Phase: ${phase}`}</Text>
      {premise && <Text>{`Premise: ${premise}`}</Text>}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {serialNumber && parseInt(serialNumber) !== 0 ? (
          <>
            <Text>{`Serial number: ${serialNumber}`}</Text>
            <Ionicons
              name="ios-checkmark-circle"
              size={24}
              color={colors.green}
              style={{ marginRight: 10, marginLeft: 5 }}
            />
          </>
        ) : (
          <Text>{`Serial number: ${serialNumber}`}</Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

DeviceCardItem.propTypes = {
  phase: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  premise: PropTypes.string,
  serialNumber: PropTypes.number
};

export default DeviceCardItem;
