import React from "react";
import renderer from "react-test-renderer";
import FlexButton from "../../components/FlexButton";

const createTestProps = props => ({
  onPress: jest.fn(),
  title: "Test",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<FlexButton {...props} />);
  expect(rendered).toBeTruthy();
});
