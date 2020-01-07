import React, {Component} from 'react';
import {
    ImageBackground,
    Platform,
    StyleSheet, Text,
    View,
} from 'react-native';

export default class PlayerDetailsScreen extends Component {

    render() {
        const {navigation} = this.props;

        return (
                <View>
                    <Text>
                        Name: {navigation.getParam('name', '??')}
                        Rating: {navigation.getParam('rating', '0')}
                    </Text>
                </View>
        );
    }
}

PlayerDetailsScreen.navigationOptions = {
    title: 'Player Details'
};

const styles = StyleSheet.create({});
