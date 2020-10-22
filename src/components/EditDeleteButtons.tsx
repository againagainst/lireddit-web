import { Box, IconButton, Link } from "@chakra-ui/core";
import { useDeletePostMutation, useMeQuery } from "generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface EditDeleteButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  id,
  creatorId,
}) => {
  const router = useRouter();
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meQuery }] = useMeQuery();
  const isMyPost = creatorId === meQuery?.me?.id;

  if (!isMyPost) {
    return null;
  }

  return (
    <Box ml="auto">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} icon="edit" aria-label="Edit Post" />
      </NextLink>
      <IconButton
        ml={2}
        icon="delete"
        aria-label="Delete Post"
        onClick={async () => {
          await deletePost({ id: id });
          router.back();
        }}
      />
    </Box>
  );
};
