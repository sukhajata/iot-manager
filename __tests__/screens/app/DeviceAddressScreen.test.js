import React from "react";
import renderer from "react-test-renderer";
//import { shallow, mount } from "enzyme";
import { InstallationDeployment } from "../../../scripts/DeploymentData";
import DeviceAddressScreen from "../../../screens/app/DeviceAddressScreen";

InstallationDeployment.Longitude = -122.406417;
InstallationDeployment.Latitude = 37.785834;

it("renders without crashing", () => {
  const rendered = renderer.create(<DeviceAddressScreen />);
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

it("Should render", async () => {
  const props = createTestProps({});

  const wrapper = await shallow(<DeviceAddressScreen {...props} />);
  //await wrapper.instance().componentDidMount();
  //console.log(wrapper.state());
  //wrapper.update();
});
*/
