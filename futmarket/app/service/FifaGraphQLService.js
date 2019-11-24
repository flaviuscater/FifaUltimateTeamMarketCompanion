import { request, GraphQLClient } from 'graphql-request'
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

// machine local ip adress
let uri = 'http://192.168.1.250:4000/graphql';

const query = gql`
query getPlayer($name: String!, $version: String!) {
  getPlayer(name: $name, version: $version) {
    name,
    rating,
    imagePath,
    _id,
    version
  }
}`;

let client = new ApolloClient({uri: uri});

const FifaGraphQLService = {
    getFifaPlayer: function(queryParam) {
        return client.query({query: query, variables: queryParam});
    }
};

export default FifaGraphQLService;