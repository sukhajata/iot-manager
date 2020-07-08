import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styles from "../styles/fields";

const KeyboardAvoider = ({ children }) => (
  <KeyboardAvoidingView
    behavior="padding"
    enabled
    keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
    style={{
      flex: 1,
      alignItems: "center"
    }}
  >
    {children}
  </KeyboardAvoidingView>
);

export default KeyboardAvoider;
