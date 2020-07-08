import React from "react";
import renderer from "react-test-renderer";
import RadioGroup from "../../components/RadioGroup";
import { getInstallationTypes } from "../../scripts/deviceSummaryService";

const createTestProps = props => ({
  options: getInstallationTypes(),
  selected: 1,
  onValueChange: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<RadioGroup {...props} />);
  expect(rendered).toBeTruthy();
});
