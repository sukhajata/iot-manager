import React from "react";
import renderer from "react-test-renderer";
import NiceButton from "../../components/WhiteButton";

const createTestProps = props => ({
  onPress: jest.fn(),
  title: "Test",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<NiceButton {...props} />);
  expect(rendered).toBeTruthy();
});
