import React, {Component} from 'react';
import {ImageBackground, Picker, Text, View} from "react-native";
import UserService from "../../app/service/UserService"
import Constants from 'expo-constants';
import styles from "./SettingsScreen.style";
import {updateConsole} from "../../app/utils/redux/actions/actions";
import {connect} from "react-redux";

class SettingsScreen extends Component {

    componentDidMount() {
        UserService.getUser()
            .then(user => {
                if (user.console !== null)
                    this.props.updateConsole(user.console)
            })
    }

    render() {
        const {console, updateConsole} = this.props;
        return (
            <ImageBackground
                source={require('../../assets/images/fifa20_background.png')}
                style={{
                    flex: 1,
                    width: null,
                    height: null,
                }}
            >
                <View style={{flex: 1, flexDirection: 'column'}}>
                    {/*<Text>{console}</Text>*/}
                    <Text style={{color: '#ffffff'}}>Choose your console: </Text>
                    <Picker style={styles.consolePicker}
                            selectedValue={console}
                            onValueChange={(itemValue, itemIndex) => {
                                updateConsole(itemValue);
                                UserService.updateUserConsole({userId: Constants.deviceId, console: itemValue})
                            }
                            }>
                        <Picker.Item label="PS4" value="PS4" color="blue"/>
                        <Picker.Item label="Xbox" value="XBOX" color="green"/>
                        <Picker.Item label="PC" value="PC" color="orange"/>
                    </Picker>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        console: state.userProperties.console
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateConsole: (console) => dispatch(updateConsole(console)),
    };
};

SettingsScreen.navigationOptions = {
    title: 'Settings',
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);