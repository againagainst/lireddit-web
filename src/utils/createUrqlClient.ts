import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { CacheExchangeOpts } from "@urql/exchange-graphcache/dist/types/cacheExchange";
import gql from "graphql-tag";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServer } from "./isServer";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const posts: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const postsCached = cache.resolve(key, "posts") as string[];
      const hasMoreCached = cache.resolve(key, "hasMore") as boolean;
      if (!hasMoreCached) {
        hasMore = hasMoreCached;
      }
      posts.push(...postsCached);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts,
    };
  };
};

const cacheExchangeOptions: CacheExchangeOpts = {
  keys: {
    PaginatedPosts: () => null,
  },
  resolvers: {
    Query: {
      posts: cursorPagination(),
    },
  },
  updates: {
    Mutation: {
      register: (_result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {
                me: result.register.user,
              };
            }
          }
        );
      },
      login: (_result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.user,
              };
            }
          }
        );
      },
      logout: (_result, args, cache, info) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          () => ({ me: null })
        );
      },
      createPost: (_result, args, cache, info) => {
        const allFields = cache.inspectFields("Query");
        const fieldInfos = allFields.filter(
          (info) => info.fieldName === "posts"
        );
        fieldInfos.forEach((fi) => {
          cache.invalidate("Query", "posts", fi.arguments || {});
        });
      },
      vote: (_result, args, cache, info) => {
        const { postId, value } = args as VoteMutationVariables;
        const postFragmentCache = cache.readFragment(
          gql`
            fragment _before on Post {
              id
              points
              voteStatus
            }
          `,
          { id: postId } as any
        );
        if (postFragmentCache) {
          if (postFragmentCache.voteStatus === value) {
            return;
          }
          const newPoints = (postFragmentCache.points as number) + value;
          cache.writeFragment(
            gql`
              fragment _after on Post {
                points
                voteStatus
              }
            `,
            {
              id: postId,
              points: newPoints,
              voteStatus: postFragmentCache.voteStatus ? null : value,
            } as any
          );
        }
      },
    },
  },
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    headers:
      isServer() && ctx.req.headers.cookie
        ? { cookie: ctx.req.headers.cookie }
        : undefined,
  },
  exchanges: [
    dedupExchange,
    cacheExchange(cacheExchangeOptions),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
