import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {PropTypes} from "prop-types";
import styles from "./SearchResultPlayerComponent.style";

export default class SearchResultPlayerComponent extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.name}</Text>
                <View style={styles.lowerPart}>
                    <Text>{this.props.rating} {this.props.version} </Text>
                    <Button
                        title="Add Player"
                        onPress={() => {
                            this.props.addPlayerMethod(this.props.name, this.props.version, this.props.rating)
                        }}
                    />
                </View>
            </View>
        );
    }
}

SearchResultPlayerComponent.propTypes = {
    name: PropTypes.string,
    rating: PropTypes.number,
    version: PropTypes.string,
    addPlayerMethod: PropTypes.func
};
