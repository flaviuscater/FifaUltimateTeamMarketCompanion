import {StyleSheet} from 'react-native';
import {FontSize, relativeHeight, relativeWidth} from "../../app/utils";

const styles = StyleSheet.create({

    MainContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        // flex: 1,
        // margin: 2
    },

    scrollViewSearchBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        margin: 2,
        borderWidth: 1,
    },
    scrollViewTransferList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        margin: 2,
        borderWidth: 1,
        // paddingBottom: 20,
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0
        // flex: 1
    },

    consolePicker: {
        //position: 'absolute',
        alignSelf: 'flex-end',
        right: 5,
        top: 5,
        height: 50,
        width: 100,
        color: '#ffffff'
        //marginTop: 10
    },

    autocompleteContainer: {
        // flex: 1,
        left: 5,
        margin: 2,
        padding: 5,
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
        height: relativeHeight(10),
        width: relativeWidth(22)
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
    popOverButton: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ccc',
        borderColor: '#333',
        borderWidth: 1,

    }

});

export default styles;