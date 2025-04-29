import {GraphQLClient} from "graphql-request";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; export const hygraph = new
GraphQLClient(import.meta.env.HYGRAPH_ENDPOINT,{
    headers: {
        Authorization: `Bearer ${import.meta.env.HYGRAPH_ACCESS_TOKEN}`,
    }
});
