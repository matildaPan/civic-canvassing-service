import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
app.use(cors());
app.use(express.json());

const typeDefs = gql(readFileSync("src/schema.graphql", "utf8"));
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  const httpServer = app.listen(4000, () => {
    console.log("🚀 Server running on http://localhost:4000/graphql");
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema, execute: undefined, subscribe: undefined }, wsServer);
}

startServer();
