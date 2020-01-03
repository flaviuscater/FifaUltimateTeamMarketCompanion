import { StyleSheet } from 'react-native';
import {relativeWidth} from "../../utils";

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
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
        right: '30%',
        top: 5,
        zIndex: 1
    },
    quickActionContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    quickActionButtonStyle: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        margin: relativeWidth(2),
        backgroundColor: 'red',
        padding: relativeWidth(5),
    },
    quickActionButtonTextStyle: {
        alignSelf: 'center',
        textAlign: 'right',
        color: 'white',
    },

    // Transfer target item

    secondaryContainer: {
        //flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
    },

    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 5,
        margin: relativeWidth(1),
        shadowRadius: 3,
        shadowOffset: {
            width: 3,
            height: 3
        },
        padding: relativeWidth(2)
    },
    profileImage: {
        borderRadius: 100,
        height: relativeWidth(15),
        width: relativeWidth(15),
        marginEnd: relativeWidth(5)
    },
    primaryTextStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    secondaryTextStyle: {
        fontWeight: "200"
    },
    pricesTextStyle: {
        flex: 2,
        justifyContent: 'flex-end'
    }

});

export default styles;