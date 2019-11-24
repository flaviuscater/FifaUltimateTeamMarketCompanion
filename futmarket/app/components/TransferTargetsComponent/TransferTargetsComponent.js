import React, {Component} from "react";
import {View, Text, FlatList, ActivityIndicator, Button, TextInput, TouchableOpacity} from "react-native";
import {Avatar, ListItem, SearchBar} from "react-native-elements";
import fifaGraphQLService from "../../service/FifaGraphQLService"
import playerPriceService from "../../service/PlayerPriceService"
import styles from './TransferTargetsComponent.style';

//import Button from "react-native-material-ui/src/Button";
class TransferTargetsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fifaPlayers: [],
            addPlayerNameText: "",
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.addFifaPlayer("Lionel Messi", "IF");
        this.addFifaPlayer("Antoine Griezmann", "IF");

        //this.updatePlayerPrices();
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

    addFifaPlayer(name, version) {
        fifaGraphQLService.getFifaPlayer({name: name, version: version})
            .then(res => {
                let fifaPlayer = res["data"]["getPlayer"];
                console.log(fifaPlayer);

                let futbinId = fifaPlayer["_id"];
                playerPriceService.getPlayerPrice(futbinId)
                    .then(response => response.json())
                    .then(data => data[futbinId]["prices"]["ps"]["LCPrice"])
                    .then(playerPrice => fifaPlayer.price = playerPrice)
                    .catch(error => console.error(error));

                if (res !== null && fifaPlayer !== null) {
                    this.setState({
                        fifaPlayers: [...this.state.fifaPlayers, fifaPlayer],
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

    // updatePlayerPrices() {
    // }

    render() {
        return (
            <View style={styles.MainContainer}>
                <TextInput
                    placeholder="Add player name"
                    onChangeText={data => this.setState({addPlayerNameText: data})}
                    style={styles.textInputStyle}
                    underlineColorAndroid='transparent'
                />
                <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => {
                    this.addFifaPlayer(this.state.addPlayerNameText, "Normal")
                }}>

                    <Text style={styles.buttonText}> Add Player </Text>

                </TouchableOpacity>

                <FlatList
                    keyExtractor={item => item._id}
                    data={this.state.fifaPlayers}
                    extraData={this.state.fifaPlayers}
                    width='100%'
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item}) => (
                        <ListItem
                            title={`${item.name}`}
                            subtitle={item.rating.toString()}
                            leftAvatar={{source: {uri: item.imagePath}}}
                            rightElement={<Text>Current price: {item.price}</Text>}
                        >
                        </ListItem>
                    )}
                />
            </View>
            /* <View>
                <Button onPress={this.getFifaPlayer()} title={"Press ME"}/>
            </View>*/

        );
    }
}

export default TransferTargetsComponent;