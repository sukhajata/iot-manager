import React from "react";
import { Card, CardItem, Body, Text } from "native-base";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";
import { DEPLOYMENT_STATES } from "../scripts/deviceSummaryService";

const DeviceCard = ({
  serialNumber,
  productName,
  deviceState,
  deploymentState,
  date,
  premise,
  onSelect
}) => (
  <Card>
    <CardItem
      button
      onPress={onSelect}
      style={{
        backgroundColor:
          deploymentState && deploymentState === DEPLOYMENT_STATES.READY
            ? colors.lightOrange
            : colors.white
      }}
    >
      <Body>
        <Text>{`Serial number: ${serialNumber}`}</Text>
        <Text>{`Product name: ${productName}`}</Text>
        <Text>{`Device state: ${deviceState}`}</Text>
        {date && <Text>{`Install date: ${date}`}</Text>}
        {premise && <Text>{`Premise: ${premise}`}</Text>}
      </Body>
    </CardItem>
  </Card>
);

DeviceCard.propTypes = {
  serialNumber: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
  deviceState: PropTypes.string.isRequired,
  deploymentState: PropTypes.number,
  date: PropTypes.string,
  premise: PropTypes.string
};

export default DeviceCard;
