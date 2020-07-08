import React from "react";
import renderer from "react-test-renderer";
import PickerWithIcon from "../../components/PickerWithIcon";
import { getCTRatios } from "../../scripts/deviceSummaryService";

const createTestProps = props => ({
  onValueChange: jest.fn(),
  selected: 1,
  options: getCTRatios(),
  title: "CT Ratios",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<PickerWithIcon {...props} />);
  expect(rendered).toBeTruthy();
});
