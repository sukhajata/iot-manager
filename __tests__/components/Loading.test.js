import React from "react";
import renderer from "react-test-renderer";
import Loading from "../../components/Loading";

test("Should render", () => {
  const rendered = renderer.create(<Loading />);
  expect(rendered).toBeTruthy();
});
