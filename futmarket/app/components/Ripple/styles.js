import {StyleSheet} from 'react-native';

const radius = 10;
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,

        backgroundColor: 'transparent',
        overflow: 'hidden',
    },

    ripple: {
        width: radius * 1.5,
        height: radius * 1.5,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'absolute',
    },
});

export {styles, radius};