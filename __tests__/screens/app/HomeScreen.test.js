import React from "react";
import renderer from "react-test-renderer";
import HomeScreen from "../../../screens/app/HomeScreen";

it("renders without crashing", () => {
  const rendered = renderer.create(<HomeScreen />);
  expect(rendered).toBeTruthy();
});
