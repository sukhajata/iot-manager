import React from "react";
import renderer from "react-test-renderer";
import ValidatedTextInput from "../../components/ValidatedTextInput";

const createTestProps = props => ({
  value: "Test",
  onChangeText: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<ValidatedTextInput {...props} />);
  expect(rendered).toBeTruthy();
});
