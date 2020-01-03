import { request, GraphQLClient } from 'graphql-request'
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

// machine local ip adress
//let uri = 'http://192.168.1.250:4000/graphql';

//wifi
let uri = 'http://192.168.1.39:4000/graphql';

const getPlayerByNameAndVersionQuery = gql`
query getPlayer($name: String!, $version: String!, $rating: Int!) {
  getPlayer(name: $name, version: $version, rating: $rating) {
    name,
    rating,
    imagePath,
    _id,
    version,
    club,
    position
  }
}`;

const getAllPlayersQuery = gql`
query getPlayers{
  getPlayers {
    name,
    rating,
    imagePath,
    _id,
    version,
    club
  }
}`;

let client = new ApolloClient({uri: uri});

const FifaGraphQLService = {
    getFifaPlayer: function(queryParam) {
        return client.query({query: getPlayerByNameAndVersionQuery, variables: queryParam});
    },
    getAllFutPlayers: function(queryParam) {
        return client.query({query: getAllPlayersQuery})
    }
};

export default FifaGraphQLService;