import React, {Component} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Colors from "../../constants/Colors";
import FutPlayerCardComponent from "./FutCardComponent/FutPlayerCardComponent";

const users = [
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
];

export default class TransferTargetsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [
                {
                    name: 'Amy Farha',
                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    subtitle: 'Vice President'
                },
                {
                    name: 'Chris Jackson',
                    avatar_url: 'https://cdn.futbin.com/content/fifa20/img/players/20801.png?v=21',
                    subtitle: 'Vice Chairman'
                }]
        }
    }

    render() {
        return (
            <FutPlayerCardComponent/>
        );
    }
}

const styles = StyleSheet.create({
    // container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
    // head: {height: 40, backgroundColor: '#808B97'},
    // text: {margin: 6},
    // row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
    // btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
    // btnText: {textAlign: 'center', color: '#fff'}
});