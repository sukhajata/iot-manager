import React from "react";
import renderer from "react-test-renderer";
import DeviceCard from "../../components/DeviceCard";

const createTestProps = props => ({
  serialNumber: 18230063,
  productName: "M11",
  deviceState: "Assigned",
  deploymentState: 4,
  date: "23/7/2021",
  premise: "23 Test St, Happy Land",
  onSelect: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<DeviceCard {...props} />);
  expect(rendered).toBeTruthy();
});
