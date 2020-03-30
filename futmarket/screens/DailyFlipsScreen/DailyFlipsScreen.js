import React, {Component} from 'react';
import {
    FlatList, Image,
    ImageBackground,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import dailyFlipsService from "../../app/service/DailyFlipsService";
import {FontSize} from "../../app/utils";
import styles from './DailyFlipsScreen.style';
import {connect} from "react-redux";


class DailyFlipsScreen extends Component {

    constructor(props) {
        super(props);

        const {userConsole} = this.props;

        this.state = {
            loading: false,
            dailyFlips: [],
            refreshing: false,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Typical usage (don't forget to compare props):
        if (this.props.userConsole !== prevProps.userConsole) {
            this.fetchData();
        }
    }

    fetchData() {
        dailyFlipsService.getDailyFlips(this.props.userConsole)
            .then(dailyFlips => {
                 //console.log(dailyFlips);
                this.setState({
                    dailyFlips: dailyFlips,
                    loading: false,
                    refreshing: false
                });
            });
    }

    render() {
        // const {console} = this.props;
        return (
            <ImageBackground
                source={require('../../assets/images/fifa20_background.png')}
                style={{
                    flex: 1,
                    width: null,
                    height: null,
                }}
            >
                <View>
                    <FlatList
                        data={this.state.dailyFlips}
                        renderItem={({item}) => this.renderListItem(item)}
                        keyExtractor={item => item._id}
                    />
                </View>
            </ImageBackground>
        );
    }

    renderListItem = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity onPress={() => this.props.navigation.push('PlayerDetails', {
                    futbinId: item._id,
                    name: item.name,
                    rating: item.rating,
                    version: item.version,
                    imageUrl: item.imageUrl,
                    position: item.position
                })}>
                    <Image style={styles.profileImage}
                           source={{uri: item.imageUrl}}/>
                </TouchableOpacity>

                <View style={styles.primaryTextStyle}>
                    <Text style={{fontSize: FontSize.fontXSmall, color: 'black'}}>
                        {item.name}
                    </Text>
                    <Text style={styles.secondaryTextStyle}>
                        {item.rating}
                    </Text>
                    <Text style={styles.secondaryTextStyle}>
                        {item.version}
                    </Text>
                </View>

                <View style={styles.pricesTextStyle}>
                    <Text style={{fontSize: FontSize.fontXSmall, color: 'black'}}>
                        Recommended Buy price: {this.getRecommendedPlayerBuyPrice(item)}
                    </Text>
                    <Text style={{fontSize: FontSize.fontXSmall, color: 'black'}}>
                        Recommended Sell price: {this.getRecommendedPlayerSellPrice(item)}
                    </Text>
                    <Text  style={(this.getPotentialProfit(item) >= 0) ? styles.green : styles.red}>
                        Potential profit: {this.getPotentialProfit(item)}
                    </Text>
                </View>
            </View>
        )
    };

    getRecommendedPlayerBuyPrice(futPlayer) {
        if (this.props.userConsole === "PS4") {
            return futPlayer.price.psPrice.currentPrice;
        } else if (this.props.userConsole === "XBOX") {
            return futPlayer.price.xboxPrice.currentPrice;
        } else {
            return futPlayer.price.pcPrice.currentPrice;
        }
    }

    getRecommendedPlayerSellPrice(futPlayer) {
        if (this.props.userConsole === "PS4") {
            return futPlayer.price.psPrice.dailyHighestPrice;
        } else if (this.props.userConsole === "XBOX") {
            return futPlayer.price.xboxPrice.dailyHighestPrice;
        } else {
            return futPlayer.price.pcPrice.dailyHighestPrice;
        }
    }

    getPotentialProfit(futPlayer) {
        if (this.props.userConsole === "PS4") {
            return (futPlayer.price.psPrice.dailyHighestPrice * 0.95) - futPlayer.price.psPrice.currentPrice;
        } else if (this.props.userConsole === "XBOX") {
            return (futPlayer.price.xboxPrice.dailyHighestPrice * 0.95) - futPlayer.price.xboxPrice.currentPrice;
        } else {
            return (futPlayer.price.pcPrice.dailyHighestPrice * 0.95) - futPlayer.price.pcPrice.currentPrice;
        }
    }

}

const mapStateToProps = (state) => {
    return {
        userConsole: state.userProperties.console
    };
};

DailyFlipsScreen.navigationOptions = {
    title: 'Daily Flips',
};

export default connect(mapStateToProps)(DailyFlipsScreen);