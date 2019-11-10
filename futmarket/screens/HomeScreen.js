
import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';

import futPlayersService from '../app/service/FifaGraphQLService';
import {Header} from "react-native-elements";
import TransferTargetsComponent from "../app/components/TransferTargetsComponent";
import FutPlayerCardComponent from "../app/components/FutCardComponent/FutPlayerCardComponent";
import FlatListDemo from "../app/components/FlatListDemo";

export default function HomeScreen() {
    return (
        <View>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'Transfer Targets', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
        <FlatListDemo/>
        </View>
    );
}

HomeScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({

});
