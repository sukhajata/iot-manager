import React from "react";
import renderer from "react-test-renderer";
import Counter from "../../components/Counter";

const createTestProps = props => ({
  value: 100,
  expectedValue: 120,
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<Counter {...props} />);
  expect(rendered).toBeTruthy();
});
