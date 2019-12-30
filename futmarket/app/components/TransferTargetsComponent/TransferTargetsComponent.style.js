import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        // margin: 2
    },

    consolePicker: {
        //position: 'absolute',
        alignSelf: 'flex-end',
        right: 5,
        top: 5,
        height: 50,
        width: 100,
        //marginTop: 10
    },

    autocompleteContainer: {
        //flex: 1,
        left: 5,
        position: 'absolute',
        right: '35%',
        top: 5,
        zIndex: 1
    },

});

export default styles;