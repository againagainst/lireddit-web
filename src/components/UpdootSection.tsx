import { ApolloCache, gql } from "@apollo/client";
import { Flex, IconButton } from "@chakra-ui/core";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  function voteAndUpdate(
    newVote: 1 | -1,
    currentVote: number | null | undefined
  ) {
    return async () => {
      if (newVote === currentVote) return;
      setLoadingState(newVote === 1 ? "updoot-loading" : "downdoot-loading");
      await vote({
        variables: { postId: post.id, value: newVote },
        update: (cache) => updateCache(newVote, post.id, cache),
      });
      setLoadingState("not-loading");
    };
  }

  function updateCache(
    newVote: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) {
    const postFragmentCache = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: "Post:" + postId,
      fragment: gql`
        fragment _before on Post {
          id
          points
          voteStatus
        }
      `,
    });

    if (postFragmentCache) {
      if (postFragmentCache.voteStatus === newVote) {
        return;
      }
      const newPoints = (postFragmentCache.points as number) + newVote;
      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment _after on Post {
            points
            voteStatus
          }
        `,
        data: {
          id: postId,
          points: newPoints,
          voteStatus: postFragmentCache.voteStatus ? null : newVote,
        },
      });
    }
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={voteAndUpdate(1, post.voteStatus)}
        isLoading={loadingState === "updoot-loading"}
        icon="chevron-up"
        aria-label="Updoot"
        variantColor={post.voteStatus === 1 ? "green" : undefined}
      />
      {post.points}
      <IconButton
        onClick={voteAndUpdate(-1, post.voteStatus)}
        isLoading={loadingState === "downdoot-loading"}
        icon="chevron-down"
        aria-label="Downdoot"
        variantColor={post.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
