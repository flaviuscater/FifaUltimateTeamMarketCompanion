
import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';

import {Header} from "react-native-elements";
import TransferTargetsComponent from "../app/components/TransferTargetsComponent/TransferTargetsComponent";

export default function HomeScreen() {
    return (
        <View>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'Transfer Targets', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
        <TransferTargetsComponent/>
        </View>
    );
}

HomeScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({

});
