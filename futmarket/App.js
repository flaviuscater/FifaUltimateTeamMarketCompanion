import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { PureComponent } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { View, Examples } from '@shoutem/ui';
import AppNavigator from './navigation/AppNavigator';

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

  async componentWillMount() {
    // await Font.loadAsync({
    //   'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
    //   'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
    //   'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
    //   'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
    //   'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
    //   'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
    //   'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
    //   'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
    //   'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
    //   'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
    //   'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
    //   Roboto: require("native-base/Fonts/Roboto.ttf"),
    //   Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    // });

    this.setState({ fontsAreLoaded: true });
  }

  render() {
    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }

    return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
          <AppNavigator/>
        </View>
    );
  }
}