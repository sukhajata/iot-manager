import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import routes from "../routes";
import { colors } from "../styles/fields";

const HomeButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(routes.HOME_SCREEN)}>
    <Ionicons
      name="ios-home"
      size={32}
      color={colors.indigo}
      style={{ marginRight: 10, marginLeft: 5 }}
    />
  </TouchableOpacity>
);

export default HomeButton;
