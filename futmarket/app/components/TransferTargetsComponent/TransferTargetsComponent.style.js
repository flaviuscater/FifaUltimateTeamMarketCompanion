import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        // margin: 2
    },

    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    outerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },

    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },

    textInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '90%',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 7,
        marginTop: 12
    },

    button: {
        width: '90%',
        height: 40,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        marginTop: 50
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
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