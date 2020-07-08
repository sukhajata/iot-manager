import React from "react";
import renderer from "react-test-renderer";
import DeviceCardItem from "../../components/DeviceCardItem";

const createTestProps = props => ({
  icp: 1233,
  phase: "blue",
  premise: "11 Happy St",
  onSelect: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<DeviceCardItem {...props} />);
  expect(rendered).toBeTruthy();
});
