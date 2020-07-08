import React from "react";
import renderer from "react-test-renderer";
import InstallTypeScreen from "../../../screens/site/InstallTypeScreen";

it("renders without crashing", () => {
  const rendered = renderer.create(<InstallTypeScreen />);
  expect(rendered).toBeTruthy();
});
