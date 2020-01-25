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
        color: '#ffffff'
        //marginTop: 10
    },
});

export default styles;