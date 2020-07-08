import React from "react";
import PropTypes from "prop-types";
import { Text, TextInput } from "react-native";
import { MapView } from "expo";

import ValidatedTextInput from "./ValidatedTextInput";
import Loading from "./Loading";
import styles from "../styles/fields";

const NiceMap = ({
  onMapPress,
  onChange,
  latitude,
  longitude,
  latitudeDelta,
  longitudeDelta,
  streetAddress1,
  streetAddress2,
  town,
  errors
}) => (
  <>
    <Text>City/Town*</Text>
    <ValidatedTextInput
      value={town}
      error={errors.town}
      onChangeText={town => onChange("town", town)}
    />
    <Text>Street address 1*</Text>
    <ValidatedTextInput
      value={streetAddress1}
      error={errors.streetAddress1}
      onChangeText={streetAddress1 =>
        onChange("streetAddress1", streetAddress1)
      }
    />
    <Text>Street address 2</Text>
    <TextInput
      value={streetAddress2}
      style={styles.textInput}
      onChangeText={streetAddress2 =>
        onChange("streetAddress2", streetAddress2)
      }
    />
    {latitude && longitude ? (
      <MapView
        style={{
          width: "80%",
          height: 300,
          marginTop: 15,
          marginBottom: 15
        }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta
        }}
        onPress={({ nativeEvent }) => onMapPress(nativeEvent)}
      >
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude
          }}
        />
      </MapView>
    ) : (
      <Loading />
    )}
  </>
);

NiceMap.propTypes = {
  onMapPress: PropTypes.func,
  onChange: PropTypes.func,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  latitudeDelta: PropTypes.number,
  longitudeDelta: PropTypes.number,
  streetAddress1: PropTypes.string,
  streetAddress2: PropTypes.string,
  town: PropTypes.string,
  errors: PropTypes.object
};

export default NiceMap;
