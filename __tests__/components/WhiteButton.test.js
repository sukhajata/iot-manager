import React from "react";
import renderer from "react-test-renderer";
import WhiteButton from "../../components/WhiteButton";

const createTestProps = props => ({
  onPress: jest.fn(),
  title: "Test",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<WhiteButton {...props} />);
  expect(rendered).toBeTruthy();
});
