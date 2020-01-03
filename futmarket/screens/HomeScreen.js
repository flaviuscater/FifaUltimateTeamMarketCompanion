
import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';

import TransferTargetsComponent from "../app/components/TransferTargetsComponent/TransferTargetsComponent";

export default function HomeScreen() {
    return (
        <View>
        <TransferTargetsComponent/>
        </View>
    );
}

HomeScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({

});
