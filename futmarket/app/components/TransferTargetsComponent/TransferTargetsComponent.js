import React, {Component} from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Picker,
} from "react-native";
import {ListItem} from "react-native-elements";
import fifaGraphQLService from "../../service/FifaGraphQLService"
import playerPriceService from "../../service/PlayerPriceService"
import styles from './TransferTargetsComponent.style';
import Autocomplete from "react-native-autocomplete-input";
import SearchResultPlayerComponent from "../SearchResultPlayerComponent/SearchResultPlayerComponent";

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
            console: "PS",
            futPlayers: [],
            searchPlayerQuery: '',
            querySelectedPlayer: {name: "", rating: 0, version: ""}
        };
    }

    componentDidMount() {
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
        if (this.state.console === "PS") {
            return currentPlayer.psPlayerPrice;
        } else if (this.state.console === "Xbox") {
            return currentPlayer.xboxPlayerPrice;
        } else {
            return currentPlayer.pcPlayerPrice;
        }
    }

    // updatePlayerPrices() {
    // }

    render() {
        const {searchPlayerQuery} = this.state;
        const futPlayers = this.findPlayer(searchPlayerQuery);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.MainContainer}>
                <Picker style={styles.consolePicker}
                        selectedValue={this.state.console}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({console: itemValue})
                        }>
                    <Picker.Item label="PS" value="PS" color="blue"/>
                    <Picker.Item label="Xbox" value="Xbox" color="green"/>
                    <Picker.Item label="PC" value="PC" color="orange"/>
                </Picker>

                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={futPlayers.length === 1 && comp(searchPlayerQuery, futPlayers[0].name) ? [] : futPlayers}
                    defaultValue={searchPlayerQuery}
                    onChangeText={text => this.setState({searchPlayerQuery: text})}
                    placeholder="Enter player name"
                    renderItem={({item}) => (
                        <TouchableOpacity activeOpacity={0.7}
                                          onPress={() => this.setState({
                                              searchPlayerQuery: item.name
                                          })}>
                            <SearchResultPlayerComponent name={item.name}
                                                         rating={item.rating}
                                                         version={item.version}
                                                         imagePath={item.imagePath}
                                                         addPlayerMethod={this.addFifaPlayer}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item._id}
                />

                {/*List of displayed players*/}
                <FlatList
                    keyExtractor={item => item._id}
                    data={this.state.transferTargetPlayers}
                    extraData={this.state}
                    width='100%'
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item}) => (
                        <ListItem
                            title={`${item.name}`}
                            subtitle={item.rating.toString()}
                            leftAvatar={{source: {uri: item.imagePath}}}
                            rightElement={<Text>Current price: {this.getCurrentConsolePlayerPrice(item._id)}</Text>}
                        >
                        </ListItem>
                    )}
                />
            </View>

        );
    }
}

export default TransferTargetsComponent;