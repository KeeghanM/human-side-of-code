import { GraphQLClient } from "graphql-request";

/**
 * GraphQL client for Hygraph content API
 * Uses the API endpoint from environment variables
 */
export const hygraph = new GraphQLClient(import.meta.env.HYGRAPH_CONTENT_API);
