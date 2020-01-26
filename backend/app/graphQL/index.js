const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
require('./config');

const Player = require('../models/Player');

const typeDefs = gql`
    type Player {
        _id: ID!,
        name: String,
        imagePath: String,
        club: String,
        nationality: String,
        league: String,
        rating: Int,
        position: String,
        version: String,
    }
    type Query {
        getPlayers: [Player]
        getPlayer(name: String!, version: String!, rating: Int!): Player
    }
    type Mutation {
        addPlayer(_id: ID!,
            name: String,
            imagePath: String!,
            club: String!,
            nationality: String!,
            league: String!,
            rating: Int!,
            position: String!,
            version: String!): Player
    }
`;

const resolvers = {
    Query: {
        getPlayer: async (parent, args) => {
            return new Promise((resolve, reject) => {
               Player.findOne({name: args.name, version: args.version, rating: args.rating}, (err, player) => {
                   if (err) {
                       reject(err);
                   } else {
                       resolve(player);
                       console.log(player)
                   }
               })
            });
        },
        getPlayers: () => Player.find().exec()
    },
    Mutation: {
        addPlayer: async (_, args) => {
            try {
                let response = await Player.create(args);
                return response;
            } catch (e) {
                return e.message;
            }
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});
const app = express();
server.applyMiddleware({app});

app.listen({port: 4000}, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);