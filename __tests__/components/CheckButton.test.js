import React from "react";
import renderer from "react-test-renderer";
import CheckButton from "../../components/CheckButton";

const createTestProps = props => ({
  checked: false,
  onPress: jest.fn(),
  title: "Test",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<CheckButton {...props} />);
  expect(rendered).toBeTruthy();
});
