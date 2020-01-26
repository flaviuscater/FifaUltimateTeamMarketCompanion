import { StyleSheet } from 'react-native';
import {FontSize, relativeHeight, relativeWidth} from "../../app/utils";

const styles = StyleSheet.create({

    cardImage: {
          //height: relativeHeight(40),
          //width: relativeWidth(40)
          height: 100,
          width: 100
    },
    consolePicker: {
        //position: 'absolute',
        alignSelf: 'flex-end',
        right: 5,
        top: 5,
        height: 50,
        width: 100,
        color: '#000000',
        //marginTop: 10
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch' // if you want to fill rows left to right
    },
    item: {
        width: '25%' // is 50% of container width
    }
});

export default styles;