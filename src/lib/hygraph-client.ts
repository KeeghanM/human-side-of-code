import {GraphQLClient} from "graphql-request";
export const hygraph = new GraphQLClient(import.meta.env.HYGRAPH_ENDPOINT,{
    headers: {
        Authorization: `Bearer ${import.meta.env.HYGRAPH_ACCESS_TOKEN}`,
    }
});
