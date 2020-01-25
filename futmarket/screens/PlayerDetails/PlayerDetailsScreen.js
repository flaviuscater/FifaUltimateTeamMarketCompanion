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
import { ToggleButton } from 'react-native-paper';

export default class PlayerDetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleButtonValue: "Daily",
            console: "ps",
            psHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            xboxHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            pcHourlyPriceArray: [{x: '2018-02-01', y: 20}],
            currentHourlyGraphArray: [{x: '2018-02-01', y: 20}],

            psDailyPriceArray: [{x: '2018-02-01', y: 20}],
            xboxDailyPriceArray: [{x: '2018-02-01', y: 20}],
            pcDailyPriceArray: [{x: '2018-02-01', y: 20}],
            currentDailyGraphArray: [{x: '2018-02-01', y: 20}],

            currentGraphArray: [{x: '2018-02-01', y: 20}]
        }
    }

    componentDidMount() {
        this.fetchHourlyTodayPlayerPrices();
        this.fetchDailyPlayerPrices();
    }

    fetchHourlyTodayPlayerPrices() {
        playerPriceService.getHourlyTodayPlayerPrice(this.props.navigation.getParam('futbinId', '0'))
            .then(res => {
                    this.setState({psHourlyPriceArray: this.constructHourlyPriceArray(res["ps"])});
                    this.setState({xboxHourlyPriceArray: this.constructHourlyPriceArray(res["xbox"])});
                    this.setState({pcHourlyPriceArray: this.constructHourlyPriceArray(res["pc"])});

                    this.setState({currentHourlyGraphArray: this.state.psHourlyPriceArray});
                    this.setState({currentDailyGraphArray: this.state.psDailyPriceArray});

                    this.setState({currentGraphArray: this.state.psDailyPriceArray});


                }
            )
            .catch(error => console.error(error));
    }

    fetchDailyPlayerPrices() {
        playerPriceService.getDailyPlayerPrice(this.props.navigation.getParam('futbinId', '0'))
            .then(res => {
                    this.setState({psDailyPriceArray: this.constructHourlyPriceArray(res["ps"])});
                    this.setState({xboxDailyPriceArray: this.constructHourlyPriceArray(res["xbox"])});
                    this.setState({pcDailyPriceArray: this.constructHourlyPriceArray(res["pc"])});

                    this.setState({currentDailyGraphArray: this.state.psDailyPriceArray})
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

    setCurrentHourlyGraphArray(console) {
        if (console === "ps") {
            this.setState({currentHourlyGraphArray: this.state.psHourlyPriceArray})
        } else if (console === "xbox") {
            this.setState({currentHourlyGraphArray: this.state.xboxHourlyPriceArray})
        } else {
            this.setState({currentHourlyGraphArray: this.state.pcHourlyPriceArray})
        }
    }


    render() {
        const {navigation} = this.props;
        const consoleColor = {ps: '#345ed1', xbox: '#4dde14', pc: '#fc6b03'};

        let graphData = [
            {
                seriesName: 'PS4',
                data: this.state.currentGraphArray,
                color: consoleColor[this.state.console],
                numberOfYAxisGuideLine: this.state.currentGraphArray.length / 2
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
                                    this.setCurrentHourlyGraphArray(console);
                                }
                                }>
                            <Picker.Item label="PS" value="ps" color="blue"/>
                            <Picker.Item label="Xbox" value="xbox" color="green"/>
                            <Picker.Item label="PC" value="pc" color="orange"/>
                        </Picker>
                    </Card>
                    <ToggleButton.Row
                        onValueChange={value => {
                            this.setState({toggleButtonValue: value});
                            if (value === "Hourly") {
                                this.setState({currentGraphArray: this.state.currentHourlyGraphArray});
                            } else {
                                this.setState({currentGraphArray: this.state.currentDailyGraphArray});
                            }
                        }}
                        value={this.state.toggleButtonValue}
                        style={{justifyContent: 'center'}}
                    >
                        <ToggleButton icon={require('../../assets/images/daily_graph.png')} value="Daily" />
                        <ToggleButton icon={require('../../assets/images/hourly_graph.png')} value="Hourly" />
                    </ToggleButton.Row>
                    <PureChart data={graphData} type='line'/>

                </SafeAreaView>
            </View>
        );
    }
}

PlayerDetailsScreen.navigationOptions = {
    title: 'Player Details'
};
