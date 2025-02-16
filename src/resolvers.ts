import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient();
const pubsub = new PubSub() as any;

export const resolvers = {
  JSON: GraphQLJSON,

  Query: {
    getHouseholds: async () =>
      await prisma.household.findMany({ where: { completed: false } }),
    getResponses: async (_: any, { householdId }: { householdId: string }) =>
      await prisma.response.findUnique({
        where: { householdId },
        include: {
          household: true,
        },
      }),
  },

  Mutation: {
    addHousehold: async (_: any, { address }: { address: string }) => {
      const household = await prisma.household.create({ data: { address } });
      pubsub.publish("HOUSEHOLD_UPDATED", { householdUpdated: household });
      return household;
    },

    removeHousehold: async (_: any, { id }: { id: string }) => {
      await prisma.response.delete({ where: { householdId: id } });
      await prisma.household.delete({ where: { id } });
      pubsub.publish("HOUSEHOLD_UPDATED", { householdUpdated: null });
      return true;
    },

    submitResponse: async (_: any, { householdId, answers }: any) => {
      const response = await prisma.response.create({
        data: { householdId, answers },
      });

      await prisma.household.update({
        where: { id: householdId },
        data: { completed: true },
      });

      pubsub.publish("HOUSEHOLD_UPDATED", {
        householdUpdated: await prisma.household.findUnique({
          where: { id: householdId },
        }),
      });

      return response;
    },
  },

  Subscription: {
    householdUpdated: {
      subscribe: () => pubsub.asyncIterator(["HOUSEHOLD_UPDATED"]),
    },
  },
};
