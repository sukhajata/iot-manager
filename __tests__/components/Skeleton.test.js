import React from "react";
import renderer from "react-test-renderer";
import Skeleton from "../../components/Skeleton";
import { View, Text } from "react-native";

const createTestProps = props => ({
  submitDisabled: false,
  handleSubmit: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(
    <Skeleton {...props}>
      <View>
        <Text>Happy to be testing</Text>
      </View>
    </Skeleton>
  );
  expect(rendered).toBeTruthy();
});
