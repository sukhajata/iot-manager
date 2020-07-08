import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//Controlled component
export default function ControlledStatusIndicator(props){
    let icon;
    switch(props.status){
        case 1:
            //Status is good
            icon = <Ionicons name={props.goodIcon} size={64} color={'black'} />
            break;
        case 2:
            //Status is pending
            icon = <View style={{height: 64, alignItems:'center', justifyContent:"center"}}><ActivityIndicator size="large" color="black"/></View>
            break;
        case 3:
            //Status is bad
            icon = <Ionicons name={props.goodIcon} size={64} color={'grey'} />
            break;
    }

    return <View style={{height: 64, flexDirection: 'row', alignItems:'center'}}>
        <View style={{width: 64, height: 64, backgroundColor: 'white'}}>
            {icon}
        </View>
        <View style={{flex:1, marginLeft:16}}>
            <Text>{props.message}</Text>
        </View>
    </View>;
};