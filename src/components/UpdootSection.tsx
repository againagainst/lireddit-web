import { Flex, IconButton } from "@chakra-ui/core";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  function voteAndUpdate(type: "up" | "down") {
    return async () => {
      setLoadingState(type === "up" ? "updoot-loading" : "downdoot-loading");
      await vote({
        postId: post.id,
        value: type === "up" ? 1 : -1,
      });
      setLoadingState("not-loading");
    };
  }
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={voteAndUpdate("up")}
        isLoading={loadingState === "updoot-loading"}
        icon="chevron-up"
        aria-label="Updoot"
        hidden={typeof post.voteStatus !== "undefined" && post.voteStatus === 1}
      />
      {post.points}
      <IconButton
        onClick={voteAndUpdate("down")}
        isLoading={loadingState === "downdoot-loading"}
        icon="chevron-down"
        aria-label="Downdoot"
        hidden={
          typeof post.voteStatus !== "undefined" && post.voteStatus === -1
        }
      />
    </Flex>
  );
};
