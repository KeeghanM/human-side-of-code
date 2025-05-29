import pThrottle from "p-throttle";
import {
  GraphQLClient,
  type RequestDocument,
  type Variables,
} from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

const throttle = pThrottle({
  limit: 5,
  interval: 1000,
});

const client = new GraphQLClient(import.meta.env.HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${import.meta.env.HYGRAPH_ACCESS_TOKEN}`,
  },
});

export const hygraphRequest = throttle(
  async <TData = any, TVariables extends Variables = Variables>(
    query: TypedDocumentNode<TData, TVariables> | RequestDocument,
  ): Promise<TData> => client.request<TData>(query),
);
