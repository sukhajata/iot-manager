import React from "react";
import renderer from "react-test-renderer";
import KeyboardAvoider from "../../components/KeyboardAvoider";
import { View, Text } from "react-native";

test("Should render", () => {
  const rendered = renderer.create(
    <KeyboardAvoider>
      <View>
        <Text>Testing</Text>
      </View>
    </KeyboardAvoider>
  );
  expect(rendered).toBeTruthy();
});
