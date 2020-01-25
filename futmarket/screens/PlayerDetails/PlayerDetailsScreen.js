import React, {Component} from 'react';
import {
    ImageBackground, Picker,
    Platform, SafeAreaView, ScrollView,
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
            console: "ps",
            psHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            xboxHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            pcHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            currentDailyGraphArray: [{x: '2018-02-01', y: 20}]
        }
    }

    componentDidMount() {
        playerPriceService.getDailyPlayerPrice(this.props.navigation.getParam('futbinId', '0'))
            .then(res => {
                    this.setState({psHourlyPriceArray: this.constructHourlyPriceArray(res["ps"])});
                    this.setState({xboxHourlyPriceArray: this.constructHourlyPriceArray(res["xbox"])});
                    this.setState({pcHourlyPriceArray: this.constructHourlyPriceArray(res["pc"])});

                    this.setState({currentDailyGraphArray: this.state.psHourlyPriceArray})
                }
            )
            .catch(error => console.error(error));
    }

    constructHourlyPriceArray(dateAndPriceArray) {
        let hourlyPricesArray = [];
        let i = 0;
        dateAndPriceArray.forEach(item => {
            hourlyPricesArray[i] = {x: new Date(item[0]).toUTCString(), y: item[1]};
            i++;
        });
        return hourlyPricesArray;
    }

    setCurrentDailyGraphArray(console) {
        if (console === "ps") {
            this.setState({currentDailyGraphArray: this.state.psHourlyPriceArray})
        } else if (console === "xbox") {
            this.setState({currentDailyGraphArray: this.state.xboxHourlyPriceArray})
        } else {
            this.setState({currentDailyGraphArray: this.state.pcHourlyPriceArray})
        }
    }


    render() {
        const {navigation} = this.props;
        const consoleColor = {ps: '#345ed1', xbox: '#4dde14', pc: '#fc6b03'};

        let graphData = [
            {
                seriesName: 'PS4',
                data: this.state.currentDailyGraphArray,
                color: consoleColor[this.state.console],
                numberOfYAxisGuideLine: this.state.currentDailyGraphArray.length / 2
            }
        ];
        return (
            <View>
                <SafeAreaView>
                    <Card title={navigation.getParam('name', '??')}>
                        <Image
                            style={styles.cardImage}
                            resizeMode="cover"
                            source={{uri: navigation.getParam('imagePath', '0')}}
                        />
                        <Text style={{marginBottom: 10}}>
                            Rating: {navigation.getParam('rating', '0')} {'\n'}
                            Position: {navigation.getParam('position', '0')}
                        </Text>
                        <Picker style={styles.consolePicker}
                                selectedValue={this.state.console}
                                onValueChange={(itemValue, itemIndex) =>{
                                    this.setState({console: itemValue});
                                    this.setCurrentDailyGraphArray(console);
                                }
                                }>
                            <Picker.Item label="PS" value="ps" color="blue"/>
                            <Picker.Item label="Xbox" value="xbox" color="green"/>
                            <Picker.Item label="PC" value="pc" color="orange"/>
                        </Picker>
                    </Card>
                    <PureChart data={graphData} type='line'/>

                </SafeAreaView>
            </View>
        );
    }
}

PlayerDetailsScreen.navigationOptions = {
    title: 'Player Details'
};
