import React from "react";
import { View, Text } from "react-native";
import { MapView } from "expo";
import PropTypes from "prop-types";

import {
  getInstallationTypeByValue,
  getIdentifierLabel
} from "../scripts/deviceSummaryService";
import { colors } from "../styles/fields";
import Loading from "./Loading";

const SiteInfoView = ({ siteInfo }) => {
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

  const installTypeLabel = getInstallationTypeByValue(siteInfo.InstallType);
  const identifierLabel = getIdentifierLabel(siteInfo.InstallType);

  return (
    <View
      style={{
        margin: 10,
        padding: 10
      }}
    >
      <Row label="Install type" value={installTypeLabel} />
      {identifierLabel && (
        <Row label={identifierLabel} value={siteInfo.InstallIdentifier} />
      )}
      {siteInfo.Location.Latitude && siteInfo.Location.Longitude ? (
        <MapView
          style={{
            width: "80%",
            height: 250,
            marginTop: 10
          }}
          initialRegion={{
            latitude: parseFloat(siteInfo.Location.Latitude),
            longitude: parseFloat(siteInfo.Location.Longitude),
            latitudeDelta: 0.002,
            longitudeDelta: 0.002
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(siteInfo.Location.Latitude),
              longitude: parseFloat(siteInfo.Location.Longitude)
            }}
          />
        </MapView>
      ) : (
        <Loading />
      )}
    </View>
  );
};

SiteInfoView.propTypes = {
  siteInfo: PropTypes.object.isRequired
};

export default SiteInfoView;
