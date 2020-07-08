import React from "react";
import { View, Text } from "react-native";

/**
 *
 * @param {object} props
 * @param {number} props.expectedValue
 * @param {number} props.value The value to be displayed, will be greener when closer to expected value, and redder when far away.
 */
const Counter = props => {
  var value = props.value
  if(typeof props == 'number' && expectedValue == 'number'){
    var difference = Math.abs(value - props.expectedValue);
    var exaggeratedDifference = (difference / props.expectedValue) * 8;
    var fontColor = `rgb(${exaggeratedDifference * 255},${255 -
      exaggeratedDifference * 255},0)`;
  }else{
    var fontColor = 'white'
  }
  return (
    <View style={{alignItems: "center",textAlign: "center"}}>
      <View style={{borderColor: "rgba(0,0,0,1)",borderWidth: 3,borderRadius: 5,width: "100%",overflow: "hidden"}}>
        <Text style={{backgroundColor: "black",color: fontColor,padding: 10}}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default Counter;
