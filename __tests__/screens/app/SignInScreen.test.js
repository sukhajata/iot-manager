import React from "react";
import renderer from "react-test-renderer";
import SignInScreen from "../../../screens/auth/SignInScreen";
//import { shallow, mount } from "enzyme";

it("renders without crashing", () => {
  const rendered = renderer.create(<SignInScreen />);
  expect(rendered).toBeTruthy();
});

/*
it('test against snapshot', () => {
    const tree = renderer.create(<SignInScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});*/
/*
jest.mock("TouchableOpacity", () => "TouchableOpacity");
*/
/*
it("renders correctly", () => {
  const wrapper = mount(<SignInScreen />);
  console.log(wrapper.debug());
  const username = wrapper
    .findWhere(node => node.prop("testID") === "username")
    .first();
  username.props().onChangeText("defaultuser");
  expect(username.value).toEqual("defaultuser");

  const password = wrapper
    .findWhere(node => node.prop("testID") === "password")
    .first();
  password.value = "powerpilotftw";
  expect(password.value).toEqual("powerpilotftw");

  const submit = wrapper.find(TouchableOpacity).first();
  //submit.props().onPress();
});
*/
