import React, {Component} from "react";
import {
    View,
    Text,
    Picker,
    Alert, Image, Button, ImageBackground, TouchableOpacity
} from "react-native";
import fifaGraphQLService from "../../app/service/FifaGraphQLService"
import playerPriceService from "../../app/service/PlayerPriceService"
import styles from './TransferTargetsComponent.style';
import Autocomplete from "react-native-autocomplete-input";
import SearchResultPlayerComponent from "../../app/components/SearchResultPlayerComponent/SearchResultPlayerComponent";
import SwipeableFlatList from 'react-native-swipeable-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ripple from "../../app/components/Ripple";
import {FontSize, relativeWidth} from "../../app/utils";

class TransferTargetsComponent extends Component {
    constructor(props) {
        super(props);
        this.addFifaPlayer = this.addFifaPlayer.bind(this);

        this.state = {
            loading: false,
            transferTargetPlayers: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            console: "ps",
            futPlayers: [],
            searchPlayerQuery: '',
            querySelectedPlayer: {name: "", rating: 0, version: ""}
        };
    }

    componentDidMount() {
        // use this for update method (FlatList has update on pull prop)
        fifaGraphQLService.getAllFutPlayers().then((json) => {
            const queryResult = json["data"]["getPlayers"];
            this.setState({futPlayers: queryResult});
        });

        this.addFifaPlayer("Lionel Messi", "IF", 95);
        this.addFifaPlayer("Antoine Griezmann", "IF", 90);

        //this.updatePlayerPrices();
    }

    findPlayer(searchPlayerQuery) {
        if (searchPlayerQuery === '') {
            return [];
        }

        const {futPlayers} = this.state;
        const regex = new RegExp(`${searchPlayerQuery.trim()}`, 'i');
        return futPlayers.filter(futPlayer => futPlayer.name.search(regex) >= 0);
    }

    addFifaPlayer(name, version, rating) {
        // Add Player if not exist already
        if (this.isPlayerPresent(this.state.transferTargetPlayers, name, version, rating)) {
            console.log("Player already exist:", name, version);
            return;
        }

        fifaGraphQLService.getFifaPlayer({name: name, version: version, rating: rating})
            .then(res => {
                let fifaPlayer = res["data"]["getPlayer"];
                //console.log(fifaPlayer);

                let futbinId = fifaPlayer["_id"];
                playerPriceService.getPlayerPrice(futbinId)
                    .then(response => response.json())
                    .then(data => {
                        fifaPlayer.psPlayerPrice = data[futbinId]["prices"]["ps"]["LCPrice"];
                        fifaPlayer.xboxPlayerPrice = data[futbinId]["prices"]["xbox"]["LCPrice"];
                        fifaPlayer.pcPlayerPrice = data[futbinId]["prices"]["pc"]["LCPrice"];
                    })
                    .catch(error => console.error(error));

                playerPriceService.getDailyPlayerPrice(futbinId)
                    .then(response => response.json())
                    .then(data => {
                        //lowest daily price todo: save the price in an object
                        fifaPlayer.psDailyLowestPlayerPrice = playerPriceService.getDailyLowestPlayerPrice(data, "ps");
                        fifaPlayer.xboxDailyLowestPlayerPrice = playerPriceService.getDailyLowestPlayerPrice(data, "xbox");
                        fifaPlayer.pcDailyLowestPlayerPrice = playerPriceService.getDailyLowestPlayerPrice(data, "pc");

                        //highest todo: save the price in an object
                        fifaPlayer.psDailyHighestPlayerPrice = playerPriceService.getDailyHighestPlayerPrice(data, "ps");
                        fifaPlayer.xboxDailyHighestPlayerPrice = playerPriceService.getDailyHighestPlayerPrice(data, "xbox");
                        fifaPlayer.pcDailyHighestPlayerPrice = playerPriceService.getDailyHighestPlayerPrice(data, "pc");

                    })
                    .catch(error => console.error(error));


                if (res !== null && fifaPlayer !== null) {
                    this.setState({
                        transferTargetPlayers: [...this.state.transferTargetPlayers, fifaPlayer],
                        error: res.error || null,
                        loading: false,
                        refreshing: false
                    });
                }

            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    isPlayerPresent(transferTargetPlayers, name, version, rating) {
        let foundPlayer = this.state.transferTargetPlayers.find(fifaPlayer => fifaPlayer.name === name && fifaPlayer.version === version && fifaPlayer.rating === rating);

        let playerExist = false;
        if (foundPlayer !== null && foundPlayer !== undefined) {
            console.log("Found Player: ", foundPlayer);
            playerExist = true;
        }
        return playerExist;
    }

    getCurrentConsolePlayerPrice(futbinId) {
        let currentPlayer = this.state.transferTargetPlayers.find((element) => {
            return element['_id'] === futbinId;
        });
        if (this.state.console === "ps") {
            return currentPlayer.psPlayerPrice;
        } else if (this.state.console === "xbox") {
            return currentPlayer.xboxPlayerPrice;
        } else {
            return currentPlayer.pcPlayerPrice;
        }
    }

    getConsoleDailyLowestPlayerPrice(futbinId) {
        let currentPlayer = this.state.transferTargetPlayers.find((element) => {
            return element['_id'] === futbinId;
        });
        if (this.state.console === "ps") {
            return currentPlayer.psDailyLowestPlayerPrice;
        } else if (this.state.console === "xbox") {
            return currentPlayer.xboxDailyLowestPlayerPrice;
        } else {
            return currentPlayer.pcDailyLowestPlayerPrice;
        }
    }

    getConsoleDailyHighestPlayerPrice(futbinId) {
        let currentPlayer = this.state.transferTargetPlayers.find((element) => {
            return element['_id'] === futbinId;
        });
        if (this.state.console === "ps") {
            return currentPlayer.psDailyHighestPlayerPrice;
        } else if (this.state.console === "xbox") {
            return currentPlayer.xboxDailyHighestPlayerPrice;
        } else {
            return currentPlayer.pcDailyHighestPlayerPrice;
        }
    }

    // updatePlayerPrices() {
    // }

    render() {
        const {searchPlayerQuery} = this.state;
        const futPlayers = this.findPlayer(searchPlayerQuery);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <ImageBackground
                source={require('../../assets/images/fifa20_background.png')}
                style={{
                    flex: 1,
                    width: null,
                    height: null,
                }}
            >
                <View style={styles.MainContainer}>
                    <Picker style={styles.consolePicker}
                            selectedValue={this.state.console}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({console: itemValue})
                            }>
                        <Picker.Item label="PS" value="ps" color="blue"/>
                        <Picker.Item label="Xbox" value="xbox" color="green"/>
                        <Picker.Item label="PC" value="pc" color="orange"/>
                    </Picker>

                    <Autocomplete
                        autoCapitalize="none"
                        refreshing={true}
                        removeClippedSubviews={true}
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        data={futPlayers.length === 1 && comp(searchPlayerQuery, futPlayers[0].name) ? [] : futPlayers}
                        defaultValue={searchPlayerQuery}
                        onChangeText={text => this.setState({searchPlayerQuery: text})}
                        placeholder="Enter player name"
                        renderItem={({item}) => (
                            <SearchResultPlayerComponent name={item.name}
                                                         rating={item.rating}
                                                         version={item.version}
                                                         imagePath={item.imagePath}
                                                         addPlayerMethod={this.addFifaPlayer}
                            />
                        )}
                        keyExtractor={item => item._id}
                    />

                    {/*List of displayed players*/}
                    <SwipeableFlatList
                        ref={(ref) => {
                            this.swipeableList = ref
                        }}
                        keyExtractor={item => item._id}
                        width='100%'
                        bounceFirstRowOnMount={false}
                        refreshing={true}
                        removeClippedSubviews={true}
                        data={this.state.transferTargetPlayers}
                        extraData={this.state}
                        maxSwipeDistance={relativeWidth(25)}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderQuickActions={({index, item}) =>
                            this.renderQuickActionButton(index, item)
                        }
                        renderItem={({item}) => this.renderListItem(item)}
                    />
                </View>
            </ImageBackground>

        );
    }

    /*UI Methods*/

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }}
            />
        );
    };

    showAlert = (index, item) => {
        this.swipeableList._onClose();
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${item.name}?`,
            [
                {
                    text: 'No',
                    onPress: () => {
                    }
                },
                {
                    text: 'Yes',
                    onPress: () => {

                        if (this.state.transferTargetPlayers[index]._id === item._id) {
                            let transferTargetPlayers = this.state.transferTargetPlayers;
                            transferTargetPlayers.splice(index, 1);
                            this.setState({transferTargetPlayers: transferTargetPlayers})

                        } else {
                            this.swipeableList._onClose()
                        }
                    },
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );
    };

    renderQuickActionButton = (index, item) => {
        return (
            <View style={styles.quickActionContainer}>
                <Ripple
                    onPress={() => {
                        this.showAlert(index, item);
                    }} style={styles.quickActionButtonStyle}>
                    <Icon
                        name={'delete'}
                        color={'white'}
                        size={25}/>
                    <Text
                        style={styles.quickActionButtonTextStyle}>
                        Delete
                    </Text>
                </Ripple>
            </View>
        )
    };

    renderListItem = (item) => {
        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity onPress={() => this.props.navigation.push('PlayerDetails', {
                    name: item.name,
                    rating: item.version,
                })}>
                    <Image style={styles.profileImage}
                           source={{uri: item.imagePath}}/>
                </TouchableOpacity>

                <View style={styles.primaryTextStyle}>
                    <Text style={{fontSize: FontSize.fontLarge, color: 'black'}}>
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
                    <Text style={{fontSize: FontSize.fontLarge, color: 'black'}}>
                        Current price: {this.getCurrentConsolePlayerPrice(item._id)}
                    </Text>
                    <Text style={styles.secondaryTextStyle}>
                        Lowest price(Today): {this.getConsoleDailyLowestPlayerPrice(item._id)}
                    </Text>
                    <Text style={styles.secondaryTextStyle}>
                        Highest price(Today): {this.getConsoleDailyHighestPlayerPrice(item._id)}
                    </Text>
                </View>
            </View>
        )
    };

    // renderListItemOld = (item) => {
    //     return (
    //         <ListItem
    //             title={`${item.name}`}
    //             subtitle={item.rating.toString()}
    //             leftAvatar={{source: {uri: item.imagePath}}}
    //             rightElement={this.renderPriceItem(item)}
    //         >
    //         </ListItem>
    //     )
    // };
    //
    // renderPriceItem = (item) => {
    //     return (
    //         <View style={styles.pricesTextStyle}>
    //             <Text style={{fontSize: FontSize.fontLarge, color: 'black'}}>
    //                 Current price: {this.getCurrentConsolePlayerPrice(item._id)}
    //             </Text>
    //             <Text style={styles.secondaryTextStyle}>
    //                 Lowest price(Today): {playerPriceService.getDailyLowestPlayerPrice(item._id, this.state.console)}
    //             </Text>
    //             <Text style={styles.secondaryTextStyle}>
    //                 Highest price(Today): {playerPriceService.getDailyHighestPlayerPrice(item._id, this.state.console)}
    //             </Text>
    //         </View>
    //     )
    // };

}

TransferTargetsComponent.navigationOptions = {
    title: 'Transfer Targets'
};

export default TransferTargetsComponent;