import {
  ApolloClient,
  InMemoryCache,
  InMemoryCacheConfig,
} from "@apollo/client";
import { PaginatedPosts } from "generated/graphql";
import { NextPageContext } from "next";
import { withApollo } from "next-apollo";

function getHeadersFromContext(
  ctx: NextPageContext | undefined
): { cookie: string } {
  let cookie = "";
  if (typeof window === "undefined") cookie = ctx?.req?.headers.cookie || "";
  return { cookie };
}

function paginationCacheConfig(): InMemoryCacheConfig {
  return {
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  };
}

function createClient(ctx: NextPageContext | undefined) {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers: getHeadersFromContext(ctx),
    credentials: "include",
    cache: new InMemoryCache(paginationCacheConfig()),
  });
}

export default withApollo(createClient);
