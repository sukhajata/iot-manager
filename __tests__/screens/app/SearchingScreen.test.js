import React from "react";
import renderer from "react-test-renderer";
//import { shallow } from "enzyme";
import SearchingScreen from "../../../screens/app/SearchingScreen";

const createTestProps = props => ({
  navigation: {
    navigate: jest.fn(),
    getParam: () => "184700081"
  },
  ...props
});

it("renders without crashing", () => {
  const props = createTestProps();
  const rendered = renderer.create(<SearchingScreen {...props} />);
  expect(rendered).toBeTruthy();
});
/*

it("test against snapshot", () => {
    const tree = renderer.create(<SearchingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
});*/
/*
const createTestProps = props => ({
  navigation: {
    navigate: jest.fn(),
    getParam: () => "184700081"
  },
  ...props
});

test("Should render", async () => {
  const props = createTestProps({});
  const wrapper = shallow(<SearchingScreen {...props} />);
  await wrapper.state("deviceInfo");
});
*/
