import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";

import Counter from "./Counter";
import SignalMeter from "./SignalMeter";
import { READING_TAGS } from "../model/DeviceTestResults";
import { colors } from "../styles/fields";
import DeviceTestResults from "../model/DeviceTestResults";

const DeviceTestItem = ({
  icp,
  premise,
  phases,
  serialNumber,
  testingState,
  results
}) => {
  const PhaseReport = ({ phase }) => (
    <>
      <View style={styles.reading}>
        <Text
          style={styles.heading}
        >{`Phase ${phase.toString()} voltage`}</Text>
        <Counter
          value={DeviceTestResults.getValue(
            results,
            READING_TAGS.VOLTAGE,
            phase
          )}
          expectedValue={230}
        />
      </View>
      <View style={styles.reading}>
        <Text
          style={styles.heading}
        >{`Phase ${phase.toString()} current`}</Text>
        <Counter
          value={DeviceTestResults.getValue(
            results,
            READING_TAGS.CURRENT,
            phase
          )}
          expectedValue={0}
        />
      </View>
    </>
  );

  return (
    <View
      style={{
        backgroundColor: colors.paleYellow,
        padding: 10,
        marginBottom: 10,
        marginRight: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "black",
        shadowOpacity: 1
      }}
    >
      <View>
        <Text>{`ICP: ${icp}`}</Text>
        <Text>{`Phase: ${phases}`}</Text>
        {premise && <Text>{`Premise: ${premise}`}</Text>}
        {serialNumber && (
          <>
            <Text>{`Serial number: ${serialNumber}`}</Text>
          </>
        )}
      </View>
      <View>
        {results && results.Received ? (
          <>
            <View style={styles.reading}>
              <Text style={styles.heading}>Signal Strength</Text>
              <SignalMeter
                strength={DeviceTestResults.signalBars(results, 100)}
              />
              <Text>{DeviceTestResults.signalBars(results, 100)}</Text>
            </View>
            {DeviceTestResults.getValue(results, READING_TAGS.VOLTAGE, 1) && (
              <PhaseReport key={1} phase={1} />
            )}
            {DeviceTestResults.getValue(results, READING_TAGS.VOLTAGE, 2) && (
              <PhaseReport key={2} phase={2} />
            )}
            {DeviceTestResults.getValue(results, READING_TAGS.VOLTAGE, 3) && (
              <PhaseReport key={3} phase={3} />
            )}
          </>
        ) : (
          <Text style={[styles.heading, { paddingTop: 50, paddingBottom: 50 }]}>
            {testingState}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reading: { marginTop: 10 },
  heading: { fontWeight: "bold", fontSize: 16 }
});

DeviceTestItem.propTypes = {
  premise: PropTypes.string,
  phases: PropTypes.string,
  serialNumber: PropTypes.number,
  testingState: PropTypes.string.isRequired,
  results: PropTypes.object
};

export default DeviceTestItem;
