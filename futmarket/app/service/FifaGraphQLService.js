import { request, GraphQLClient } from 'graphql-request'
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import ApiConstants from "../../constants/ApiConstants";

let uri = ApiConstants.API_GRAPH_QL_SERVER_BASE_PATH;

const getPlayerByNameAndVersionQuery = gql`
query getPlayer($name: String!, $version: String!, $rating: Int!) {
  getPlayer(name: $name, version: $version, rating: $rating) {
    name,
    rating,
    imageUrl,
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
    imageUrl,
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