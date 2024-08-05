import express from "express";
import bodyParser from "body-parser";
const cors = require("cors");
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./user";
import { Tweet } from "./tweet";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

export async function initServer() {
  const app = express();

  app.use(bodyParser.json());

  app.use(cors());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.types}
      ${Tweet.types}

            type Query {
                ${User.queries}
                ${Tweet.queries}
                }

            type Mutation {
            ${Tweet.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        const authHeader = req.headers.authorization;
        return {
          user: authHeader
            ? JWTService.decodeToken(authHeader.split("Bearer ")[1])
            : undefined,
        };
      },
    })
  );

  return app;
}
