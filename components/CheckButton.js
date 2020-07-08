import React from "react";
import { Button, Text } from "native-base";
import PropTypes from "prop-types";
import { colors } from "../styles/fields";

const CheckButton = ({ checked, onPress, title, color }) => (
  <>
    {checked && color === colors.white && (
      <Button bordered onPress={onPress} style={{ borderColor: colors.black }}>
        <Text style={{ color: colors.black }}>{title}</Text>
      </Button>
    )}
    {checked && color !== colors.white && (
      <Button style={{ backgroundColor: color }} onPress={onPress}>
        <Text style={{ color: "white" }}>{title}</Text>
      </Button>
    )}
    {!checked && (
      <Button style={{ backgroundColor: "lightgrey" }} onPress={onPress}>
        <Text>{title}</Text>
      </Button>
    )}
  </>
);

CheckButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string
};

CheckButton.defaultProps = {
  color: colors.indigo
};

export default CheckButton;
