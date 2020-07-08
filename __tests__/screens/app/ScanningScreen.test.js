import React from "react";
import renderer from "react-test-renderer";
import ScanningScreen from "../../../screens/app/ScanningScreen";
import { withNavigation } from "react-navigation";

jest.mock("react-navigation");

const createTestProps = props => ({
  navigation: {
    navigate: jest.fn(),
    getParam: () => "184700081"
  },
  ...props
});

it("renders without crashing", () => {
  const props = createTestProps();
  const screen = withNavigation(<ScanningScreen {...props} />);
  const rendered = renderer.create(screen);
  expect(rendered).toBeTruthy();
});
