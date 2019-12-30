import { StyleSheet } from 'react-native';
import Constants from "expo-constants";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16,
    },
    button: {
        width: 75,
        height: 25,
        padding: 5,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        marginTop: 10
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },

    lowerPart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

});

export default styles;