import { StyleSheet } from 'react-native';
import {FontSize, relativeHeight, relativeWidth} from "../../app/utils";

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
        // flex: 1,
        // margin: 2
    },

    dailyFlipsFlatList: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 5,
        margin: 2,
        borderWidth: 1,
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
        borderRadius: 75,
        height: relativeWidth(15),
        width: relativeWidth(15),
        marginEnd: relativeWidth(1)
    },
    primaryTextStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    secondaryTextStyle: {
        fontWeight: "200",
        fontSize: FontSize.fontXXSmall
    },
    pricesTextStyle: {
        flex: 2,
        justifyContent: 'flex-end'
    },

    green: {
        color: '#3DB84E'
    },
    red: {
        color: '#ff0000'
    }

});

export default styles;