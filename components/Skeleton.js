import React from "react";
import { ScrollView, View } from "react-native";
import PropTypes from "prop-types";

import KeyboardAvoider from "./KeyboardAvoider";
import NiceButton from "./NiceButton";

const Skeleton = ({ children, submitDisabled, handleSubmit }) => (
  <KeyboardAvoider>
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{ margin: 10, width: "90%", flex: 1 }}
      contentContainerStyle={{
        justifyContent: "space-between"
      }}
    >
      <View>{children}</View>
      <NiceButton
        testID="submit"
        disabled={submitDisabled}
        onPress={handleSubmit}
        title="OK"
      />
    </ScrollView>
  </KeyboardAvoider>
);

Skeleton.propTypes = {
  submitDisabled: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired
};

Skeleton.defaultProps = {
  submitDisabled: false
};

export default Skeleton;
