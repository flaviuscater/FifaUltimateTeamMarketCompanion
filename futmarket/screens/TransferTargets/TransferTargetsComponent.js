import React, {Component} from "react";
import {
    View,
    Text,
    Picker,
    Alert,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator, TextInput,
} from "react-native";
import fifaGraphQLService from "../../app/service/FifaGraphQLService"
import transferTargetService from "../../app/service/TransferTargetsService"
import styles from './TransferTargetsComponent.style';
import Autocomplete from "react-native-autocomplete-input";
import SearchResultPlayerComponent from "../../app/components/SearchResultPlayerComponent/SearchResultPlayerComponent";
import SwipeableFlatList from 'react-native-swipeable-list';
import Ripple from "../../app/components/Ripple";
import {FontSize, relativeWidth, latinize, compareRating} from "../../app/utils";
import registerForPushNotificationsAsync from "../../app/service/NotificationService";
import ApiConstants from "../../constants/ApiConstants"
import Icon from 'react-native-vector-icons/Entypo';

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
            console: "PS4",
            futPlayers: [],
            searchPlayerQuery: '',
            querySelectedPlayer: {name: "", rating: 0, version: ""},
            isPopOverVisible: true
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        // use this for update method (FlatList has update on pull prop)
        fifaGraphQLService.getAllFutPlayers().then((json) => {
            const queryResult = json["data"]["getPlayers"];
            this.setState({futPlayers: queryResult});
        });

        transferTargetService.getTransferTargets()
            .then(userTransferTargets => {
                //console.log(userTransferTargets);
                userTransferTargets.forEach(u => this.saveTransferTargetPlayerPrices(u));
                this.setState({
                    transferTargetPlayers: userTransferTargets,
                    loading: false,
                    refreshing: false
                });
            });

        // registerForPushNotificationsAsync()
        //     .then(response => console.log(JSON.stringify(response)))
        //     // .then(response => console.log(response))
        //     .catch(function (error) {
        //         console.log('Fail to save push token: ' + error.message);
        //     });
        //this.updatePlayerPrices();
    }

    findPlayer(searchPlayerQuery) {
        if (searchPlayerQuery === '' || searchPlayerQuery.length < 2) {
            return [];
        }

        const {futPlayers} = this.state;
        const regex = new RegExp(`${searchPlayerQuery.trim()}`, 'i');
        // Latinize search query ( transform letters like èé to e")
        return futPlayers.filter(futPlayer => latinize(futPlayer.name).search(regex) >= 0);
    }

    // Get player from graphQL, fetch price(optionally), and make a call to save the transfer target
    addFifaPlayer(name, version, rating) {
        // check list size
        if (this.state.transferTargetPlayers.length >= ApiConstants.TRANSFER_TARGET_LIST_MAX_SIZE) {
            this.fullListAlert();
            return;
        }

        this.setState({
            loading: true,
        });
        // Add Player if not exist already
        if (this.isPlayerPresent(this.state.transferTargetPlayers, name, version, rating)) {
            console.log("Player already exist:", name, version);
            return;
        }

        fifaGraphQLService.getFifaPlayer({name: name, version: version, rating: rating})
            .then(res => {
                let fifaPlayer = res["data"]["getPlayer"];
                transferTargetService.addTransferTarget(fifaPlayer)
                    .then(res => {
                        if (res !== null && fifaPlayer !== null) {
                            fifaPlayer = res;
                            console.log(fifaPlayer);
                            fifaPlayer = this.saveTransferTargetPlayerPrices(fifaPlayer);
                            this.setState({
                                transferTargetPlayers: [...this.state.transferTargetPlayers, fifaPlayer],
                                error: res.error || null,
                                loading: false,
                                refreshing: false
                            });
                        }
                    });

            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    //old implementation, todo: refactor
    saveTransferTargetPlayerPrices(fifaPlayer) {
        fifaPlayer.psPlayerPrice = fifaPlayer.price.psPrice.currentPrice;
        fifaPlayer.xboxPlayerPrice = fifaPlayer.price.xboxPrice.currentPrice;
        fifaPlayer.pcPlayerPrice = fifaPlayer.price.pcPrice.currentPrice;

        fifaPlayer.psDailyLowestPlayerPrice = fifaPlayer.price.psPrice.dailyHighestPrice;
        fifaPlayer.xboxDailyLowestPlayerPrice = fifaPlayer.price.xboxPrice.dailyHighestPrice;
        fifaPlayer.pcDailyLowestPlayerPrice = fifaPlayer.price.pcPrice.dailyHighestPrice;

        //highest todo: save the price in an object
        fifaPlayer.psDailyHighestPlayerPrice = fifaPlayer.price.psPrice.dailyHighestPrice;
        fifaPlayer.xboxDailyHighestPlayerPrice = fifaPlayer.price.xboxPrice.dailyHighestPrice;
        fifaPlayer.pcDailyHighestPlayerPrice = fifaPlayer.price.pcPrice.dailyHighestPrice;

        return fifaPlayer;
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
        let currentPlayerPrice = this.getCurrentPlayerPrice(futbinId);
        if (this.state.console === "PS4") {
            return currentPlayerPrice.psPrice.currentPrice;
        } else if (this.state.console === "XBOX") {
            return currentPlayerPrice.xboxPrice.currentPrice;
        } else {
            return currentPlayerPrice.pcPrice.currentPrice;
        }
    }

    getConsoleDailyLowestPlayerPrice(futbinId) {
        let currentPlayerPrice = this.getCurrentPlayerPrice(futbinId);
        if (this.state.console === "PS4") {
            return currentPlayerPrice.psPrice.dailyLowestPrice;
        } else if (this.state.console === "XBOX") {
            return currentPlayerPrice.xboxPrice.dailyLowestPrice;
        } else {
            return currentPlayerPrice.pcPrice.dailyLowestPrice;
        }
    }

    getConsoleDailyHighestPlayerPrice(futbinId) {
        let currentPlayerPrice = this.getCurrentPlayerPrice(futbinId);
        if (this.state.console === "PS4") {
            return currentPlayerPrice.psPrice.dailyHighestPrice;
        } else if (this.state.console === "XBOX") {
            return currentPlayerPrice.xboxPrice.dailyHighestPrice;
        } else {
            return currentPlayerPrice.pcPrice.dailyHighestPrice;
        }
    }

    getCurrentPlayerPrice(futbinId) {
        let currentPlayer = this.state.transferTargetPlayers.find((element) => {
            return element['_id'] === futbinId;
        });
        return currentPlayer.price;
    }

    renderInput = props => (
        <TextInput {...props} ref={component => this._textInput = component}/>
    );


    onRefresh = () => {
        this.setState({refreshing: true});
        fifaGraphQLService.getAllFutPlayers().then((json) => {

            transferTargetService.getTransferTargets()
                .then(userTransferTargets => {
                    //console.log(userTransferTargets);
                    userTransferTargets.forEach(u => this.saveTransferTargetPlayerPrices(u));
                    this.setState({
                        transferTargetPlayers: userTransferTargets,
                        loading: false,
                        refreshing: false
                    });
                });
        });

    };

    render() {
        const {searchPlayerQuery} = this.state;
        const futPlayers = this.findPlayer(searchPlayerQuery);
        // sort fut Players by rating
        futPlayers.sort(compareRating);
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
                <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}/>
                <View style={styles.MainContainer}>
                    <View>
                        <View style={{
                            zIndex: 2,
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            marginTop: 14,
                            marginRight: 10
                        }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({searchPlayerQuery: ''});
                                this._textInput.setNativeProps({text: ''});
                            }}>
                                <Icon
                                    name='circle-with-cross'
                                    type='entypo'
                                    size={30}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </View>

                        <Autocomplete
                            renderTextInput={this.renderInput}
                            clearButtonMode={'always'}
                            listContainerStyle={{height: futPlayers.length * 70}}
                            autoCapitalize="none"
                            ref={input => {
                                this.textInput = input
                            }}
                            refreshing={true}
                            removeClippedSubviews={true}
                            autoCorrect={false}
                            containerStyle={styles.autocompleteContainer}
                            data={futPlayers.length === 1 && comp(searchPlayerQuery, futPlayers[0].name) ? [] : futPlayers}
                            defaultValue={searchPlayerQuery}
                            onChangeText={text => this.setState({searchPlayerQuery: text})}
                            placeholder="Enter player name"
                            renderItem={({item}) => (
                                <ScrollView contentContainerStyle={styles.scrollViewSearchBar}>
                                    <SearchResultPlayerComponent name={item.name}
                                                                 rating={item.rating}
                                                                 version={item.version}
                                                                 imageUrl={item.imageUrl}
                                                                 addPlayerMethod={this.addFifaPlayer}
                                    />
                                </ScrollView>
                            )}
                            keyExtractor={item => item._id}
                        />

                        <Picker style={styles.consolePicker}
                                selectedValue={this.state.console}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({console: itemValue})
                                }>
                            <Picker.Item label="PS4" value="PS4" color="blue"/>
                            <Picker.Item label="Xbox" value="XBOX" color="green"/>
                            <Picker.Item label="PC" value="PC" color="orange"/>
                        </Picker>
                    </View>

                    {/*List of displayed players*/}
                    <View style={styles.swipeableTransferList}>
                        <SwipeableFlatList
                            // contentContainerStyle={styles.swipeableTransferList}
                            ref={(ref) => {
                                this.swipeableList = ref
                            }}
                            keyExtractor={item => item._id}
                            width='100%'
                            bounceFirstRowOnMount={false}
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}
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
                    <Text style={{color: 'white', margin: 2, padding: 5}}>Transfer Targets
                        size: {this.state.transferTargetPlayers.length} / {ApiConstants.TRANSFER_TARGET_LIST_MAX_SIZE}</Text>
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
            'Delete Transfer Target',
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

                            // also remove from DB
                            transferTargetService.deleteTransferTarget(item._id);

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
                        name={'trash'}
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
    fullListAlert = (index, item) => {
        Alert.alert(
            'Transfer Target List is full',
            `You can clear up space by sliding left on a player and press the delete button.`,
            [
                {
                    text: 'Ok',
                    onPress: () => {
                    }
                }]
        )
    };

    showPopover() {
        this.setState({isPopOverVisible: true});
    }

    closePopover() {
        this.setState({isPopOverVisible: false});
    }

    // renderListItemOld = (item) => {
    //     return (
    //         <ListItem
    //             title={`${item.name}`}
    //             subtitle={item.rating.toString()}
    //             leftAvatar={{source: {uri: item.imageUrl}}}
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