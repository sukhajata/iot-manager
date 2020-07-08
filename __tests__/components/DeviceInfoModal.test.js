import React from "react";
import renderer from "react-test-renderer";
import DeviceInfoModal from "../../components/DeviceInfoModal";

const createTestProps = props => ({
  installation: {
    Longitude: -122.406417,
    Latitude: 37.785834,
    InstallCheckResults: "",
    ICPNumber: "123",
    PremiseLocation: {
      Id: 99,
      AddressLine1: "20 Happy St",
      AddressLine2: "",
      AddressLine3: null,
      City: "San Francisco",
      Region: null,
      PostCode: null,
      Country: "United States"
    },
    InstallType: 2,
    MeteringRed: false,
    MeteringWhite: true,
    MeteringBlue: true,
    InstallIdentifier: "",
    PrimaryCT: 200,
    PremiseLocationFK: 99,
    Id: 508,
    DeployerUserFK: 1,
    DeviceFK: 223,
    DeploymentDate: "2019-06-28T03:00:36.42734",
    DeployerUser: null,
    Device: {
      CurrentBackendConfiguration: null,
      CurrentDeviceConfiguration: null,
      CurrentInstallation: null,
      CurrentSoftware: null,
      DeviceOrder: null,
      Id: 223,
      DevEUI: "BE7A0200000002DC",
      ProductName: "M11",
      OrderFK: 1,
      DeviceTypeRequirement: 2,
      DeviceState: 5,
      Extensions: null,
      SerialNumber: 18470081,
      MACAddress: "240ac40a2818",
      DeviceType: 2,
      TestResults:
        '{"Test Result":"True","ExternalLoraRxrssi":"100","ExternalLoraRxSNR":"0","ExternalLoraTxrssi":"100","Lastgasp":"8","LoraRxrssi":"-101","LoraRxSNR":"6","LoraTxrssi":"-104","PfPinCorrect":"True","Timestamp":"2019-01-15T21:57:41.6564111+00:00"}',
      SoftwareDeployments: null,
      Notes: null,
      CurrentSoftwareFK: 4,
      DeviceConfigurationDeployments: null,
      CurrentDeviceConfigurationFK: 121,
      BackendConfigurationDeployments: null,
      CurrentBackendConfigurationFK: 121,
      InstallationDeployments: null,
      CurrentInstallationFK: null
    },
    DeploymentState: 4,
    DeploymentMethod: 0
  },
  modalVisible: true,
  next: jest.fn(),
  hideModal: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<DeviceInfoModal {...props} />);
  expect(rendered).toBeTruthy();
});
