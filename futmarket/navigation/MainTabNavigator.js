import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../app/components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import PlayerDetailsScreen from "../screens/PlayerDetails/PlayerDetailsScreen";
import TransferTargetsComponent from "../screens/TransferTargets/TransferTargetsComponent";

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const HomeStack = createStackNavigator(
    {
        Home: TransferTargetsComponent,
        PlayerDetails: PlayerDetailsScreen
    },
    config
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Transfer Targets',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-information-circle${focused ? '' : '-outline'}`
                    : 'md-information-circle'
            }
        />
    ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
    {
        Links: LinksScreen,
    },
    config
);

LinksStack.navigationOptions = {
    tabBarLabel: 'Links',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}/>
    ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
    {
        Settings: SettingsScreen,
    },
    config
);

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}/>
    ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
