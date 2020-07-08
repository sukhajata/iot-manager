import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import {
  getInstallationTypeByValue,
  getIdentifierLabel,
  getCTRatioLabel,
  getPhases
} from "../scripts/deviceSummaryService";
import { colors } from "../styles/fields";

const DeviceInfoView = ({
  installationDeployment,
  deviceInfo,
  premiseLocation
}) => {
  const Row = ({ label, value }) => (
    <View
      style={{
        height: 30,
        flexDirection: "row",
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 5
      }}
    >
      <View style={{ flex: 1 }}>
        <Text>{label}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{value}</Text>
      </View>
    </View>
  );

  const installTypeLabel = getInstallationTypeByValue(
    installationDeployment.InstallType
  );
  const identifierLabel = getIdentifierLabel(
    installationDeployment.InstallType
  );
  const phases = getPhases(
    installationDeployment.MeteringRed,
    installationDeployment.MeteringWhite,
    installationDeployment.MeteringBlue
  );

  return (
    <View
      style={{
        margin: 10,
        padding: 10
      }}
    >
      <Row label="Product name" value={deviceInfo.ProductName} />
      <Row label="Serial number" value={deviceInfo.SerialNumber} />
      <Row label="Install type" value={installTypeLabel} />
      {identifierLabel && (
        <Row
          label={identifierLabel}
          value={installationDeployment.InstallIdentifier}
        />
      )}
      {installationDeployment.InstallType !== 4 && (
        <Row label="ICP number" value={installationDeployment.ICPNumber} />
      )}
      <Row
        label="CT ratio"
        value={getCTRatioLabel(installationDeployment.PrimaryCT)}
      />
      <Row label="Phase" value={phases} />
      <Row label="Street address" value={premiseLocation.AddressLine1} />
      <Row label="Town" value={premiseLocation.City} />
    </View>
  );
};

DeviceInfoView.propTypes = {
  deviceInfo: PropTypes.object.isRequired,
  installationDeployment: PropTypes.object.isRequired,
  premiseLocation: PropTypes.object.isRequired
};

export default DeviceInfoView;
