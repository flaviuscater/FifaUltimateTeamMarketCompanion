import {AppLoading} from 'expo';
import React, {PureComponent} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import {Provider} from 'react-redux';
import store from "./app/utils/redux/store";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default class App extends PureComponent {
    state = {
        fontsAreLoaded: false,
    };

    componentDidMount() {
        this.setState({fontsAreLoaded: true});
    }

    render() {

        if (!this.state.fontsAreLoaded) {
            return <AppLoading/>;
        }

        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <AppNavigator/>
                </View>
            </Provider>
        );
    }

}