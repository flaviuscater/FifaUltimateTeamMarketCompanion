import React, {Component} from 'react';
import {
    ImageBackground,
    Platform, ScrollView,
    StyleSheet, Text,
    View,
} from 'react-native';
import {Card, Image} from "react-native-elements";
import styles from "./PlayerDetailsScreen.style";
import {width} from "../../app/utils/index.js";
import playerPriceService from "../../app/service/PlayerPriceService";
import PureChart from "react-native-pure-chart";

export default class PlayerDetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            psHourlyPriceArray: [],
            xboxHourlyPriceArray: [],
            pcHourlyPriceArray: [],
            hourlyGraphLabels: []
        };
    }

    componentDidMount() {
        playerPriceService.getDailyPlayerPrice(this.props.navigation.getParam('futbinId', '0'))
            .then(res => {
                    this.setState({psHourlyPriceArray:  this.constructHourlyPriceArray(res["ps"])});
                    //this.setState({xboxHourlyPriceArray: this.constructHourlyPriceArray(res["xbox"])});
                    //this.setState({pcHourlyPriceArray: this.constructHourlyPriceArray(res["pc"])});
                }
            )
            .catch(error => console.error(error));
    }

    getHourlyGraphLabels(array) {
       return array.map(function (item) {
            // first element from the Array is the epoch time timestamp
            return new Date(item[0]).getHours();
        })
           //.filter((item) => item % 2 === 0);
    }

    constructHourlyPriceArray(dateAndPriceArray) {
        let hourlyPricesArray = [];
        let i = 0;
        dateAndPriceArray.forEach(item => {
            hourlyPricesArray[i] = {x: new Date(item[0]), y: item[1]};
            i++;
        });
        return hourlyPricesArray;
    }

    render() {
        const {navigation} = this.props;

        let graphData = [
            {
                seriesName: 'series1',
                data: [
                            {x: '2018-02-01', y: 20},
                            {x: '2018-02-02', y: 100},
                            {x: '2018-02-03', y: 140},
                            {x: '2018-02-04', y: 550},
                            {x: '2018-02-05', y: 40}
                        ],
                //data: this.state.psHourlyPriceArray,
                color: '#297AB1'
            }
            // {
            //     seriesName: 'series2',
            //     data: [
            //         {x: '2018-02-01', y: 20},
            //         {x: '2018-02-02', y: 100},
            //         {x: '2018-02-03', y: 140},
            //         {x: '2018-02-04', y: 550},
            //         {x: '2018-02-05', y: 40}
            //     ],
            //     //data: this.state.xboxHourlyPriceArray,
            //     color: 'green'
            // }
        ];
        //console.log(this.state.psHourlyPriceArray);
        //console.log(sampleData[0].data);
        return (
            <View>
                <ScrollView>
                    <Card title={navigation.getParam('name', '??')}>
                        <Image
                            style={styles.cardImage}
                            resizeMode="cover"
                            source={{uri: navigation.getParam('imagePath', '0') }}
                        />
                        <Text style={{marginBottom: 10}}>
                            Rating: {navigation.getParam('rating', '0')} {'\n'}
                            Position: {navigation.getParam('position', '0')}
                        </Text>
                    </Card>
                    <PureChart data={graphData} type='line' />

                </ScrollView>
            </View>
        );
    }
}

PlayerDetailsScreen.navigationOptions = {
    title: 'Player Details'
};
