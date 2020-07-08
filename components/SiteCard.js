import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, CardItem, Body, Text } from "native-base";
import PropTypes from "prop-types";

import {
  getInstallationTypeByValue,
  getIdentifierLabel
} from "../scripts/deviceSummaryService";
import { colors } from "../styles/fields";

const SiteCard = ({ siteInfo, onSelect }) => {
  let address = null;
  let city = null;
  let backColor = colors.green;
  if (siteInfo.DetailsOfInstalls && siteInfo.DetailsOfInstalls.length > 0) {
    siteInfo.DetailsOfInstalls.forEach(detail => {
      if (detail.MeteredPremiseLocation) {
        if (address) {
          address += ", " + detail.MeteredPremiseLocation.AddressLine1;
        } else {
          address = detail.MeteredPremiseLocation.AddressLine1;
        }
        city = detail.MeteredPremiseLocation.City;
      }
      if (!detail.Device) {
        backColor = colors.white;
      }
    });
  }
  if (siteInfo.Enclosures && siteInfo.Enclosures.length > 0) {
    siteInfo.Enclosures.forEach(enclosure => {
      if (
        enclosure.DetailsOfInstalls &&
        enclosure.DetailsOfInstalls.length > 0
      ) {
        enclosure.DetailsOfInstalls.forEach(detail => {
          if (detail.MeteredPremiseLocation) {
            if (address) {
              address += ", " + detail.MeteredPremiseLocation.AddressLine1;
            } else {
              address = detail.MeteredPremiseLocation.AddressLine1;
            }
            city = detail.MeteredPremiseLocation.City;
          }
          if (!detail.Device) {
            backColor = colors.white;
          }
        });
      }
    });
  }
  if (!address) {
    address = "";
    city = "";
  }

  const formatDate = dd => {
    const dateObject = new Date(dd);
    return (
      dateObject.getDate() +
      "/" +
      (dateObject.getMonth() + 1) + //months are zero based
      "/" +
      dateObject.getFullYear()
    );
  };

  return (
    <Card>
      <CardItem
        button
        onPress={onSelect}
        style={{ backgroundColor: backColor }}
      >
        <Body>
          <View style={styles.item}>
            <Text style={styles.header}>Address: </Text>
            <Text style={{ flex: 1, flexWrap: "wrap" }}>{address}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.header}>Town: </Text>
            <Text>{city}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.header}>Install type: </Text>
            <Text>{getInstallationTypeByValue(siteInfo.InstallType)}</Text>
          </View>
          {siteInfo.InstallType !== 2 && siteInfo.InstallType !== 3 && (
            <View style={styles.item}>
              <Text style={styles.header}>
                {getIdentifierLabel(siteInfo.InstallType)}:{" "}
              </Text>
              <Text>{siteInfo.InstallIdentifier.toString()}</Text>
            </View>
          )}
          <View style={styles.item}>
            <Text style={styles.header}>Date modified: </Text>
            <Text>{formatDate(siteInfo.DateModified)}</Text>
          </View>
        </Body>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold"
  },
  item: {
    flexDirection: "row"
  }
});

SiteCard.propTypes = {
  siteInfo: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default SiteCard;
