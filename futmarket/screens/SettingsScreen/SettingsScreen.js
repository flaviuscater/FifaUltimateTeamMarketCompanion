import React, {Component} from 'react';
import {ImageBackground, Picker, ScrollView, Switch, Text, View} from "react-native";
import UserService from "../../app/service/UserService"
import Constants from 'expo-constants';
import styles from "./SettingsScreen.style";
import {updateConsole} from "../../app/utils/redux/actions/actions";
import {connect} from "react-redux";
import SettingsCategoryHeader from "react-native-settings-components/src/category-header/category-header";
import {
    SettingsDividerLong,
    SettingsDividerShort,
    SettingsPicker,
    SettingsSwitch
} from "react-native-settings-components";

class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEnabled: false,
            allowPushNotifications: false
        };
    }

    componentDidMount() {
        UserService.getUser()
            .then(user => {
                if (user.console !== null)
                    this.props.updateConsole(user.console);
                    this.setState({allowPushNotifications: user.allowPushNotifications})
            })
    }

    render() {
        const {userConsole, updateConsole} = this.props;
        return (
                <ScrollView
                    style={{
                        flex: 1,
                        backgroundColor: colors.white
                    }}
                >
                    <SettingsCategoryHeader
                        title={"My Account"}
                        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
                    />
                    <SettingsDividerLong android={false} />
                    <SettingsPicker
                        title="Console"
                        dialogDescription={"Choose your console."}
                        options={[
                            { label: "PS4", value: "PS4" },
                            { label: "XBOX", value: "XBOX" },
                            { label: "PC", value: "PC" }
                        ]}
                        onValueChange={value => {
                            console.log("console:", value);
                            updateConsole(value);
                            UserService.updateUser({userId: Constants.deviceId, console: value, allowPushNotifications: this.state.allowPushNotifications})
                        }}
                        value={userConsole}
                        styleModalButtonsText={{ color: colors.monza }}
                    />
                    <SettingsDividerShort />
                    <SettingsSwitch
                        title={"Allow Push Notifications"}
                        onValueChange={value => {
                            console.log("allow push notifications:", value);
                            this.setState({
                                allowPushNotifications: value
                            });
                            UserService.updateUser({userId: Constants.deviceId, console: userConsole, allowPushNotifications: value})
                        }}
                        value={this.state.allowPushNotifications}
                        trackColor={{
                            true: colors.switchEnabled,
                            false: colors.switchDisabled,
                        }}
                    />
                </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userConsole: state.userProperties.console
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateConsole: (userConsole) => dispatch(updateConsole(userConsole)),
    };
};

const colors = {
    white: "#FFFFFF",
    monza: "#C70039",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
};

SettingsScreen.navigationOptions = {
    title: 'Settings',
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);