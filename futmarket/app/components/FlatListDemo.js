import React, {Component} from "react";
import {View, Text, FlatList, ActivityIndicator, Button} from "react-native";
import {Avatar, ListItem, SearchBar} from "react-native-elements";
import fifaGraphQLService from "../service/FifaGraphQLService"
//import Button from "react-native-material-ui/src/Button";

class FlatListDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fifaPlayers: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.getFifaPlayer();
    }

    getFifaPlayer() {
        fifaGraphQLService.getFifaPlayer({name: "Lionel Messi", rating: 94})
            .then(res => {
                console.log(JSON.stringify(res));
                console.log(res["data"]["getPlayer"]);
                this.setState({
                    fifaPlayers: [...this.state.fifaPlayers, res["data"]["getPlayer"]],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    }

    makeRemoteRequest = () => {
        const {page, seed} = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;

        this.setState({loading: true});
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: page === 1 ? res.results : [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    render() {
        return (
            <FlatList
                data={this.state.fifaPlayers}
                renderItem={({item}) => (
                    <ListItem
                        title={`${item.name}`}
                        subtitle={item.rating}
                        leftAvatar={{ source: { uri: item.imagePath} }}
                    />
                )}
            />
/*            <View>
                <Button onPress={this.getFifaPlayer()} title={"Press ME"}/>
            </View>*/

        );
    }
}

export default FlatListDemo;