import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useGetPostFromUrl } from "utils/useGetPostFromUrl";
import { Layout } from "../../components/Layout";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const Post = ({}) => {
  const router = useRouter();
  const postId = useGetPostFromUrl();
  const [{ data: postQuery, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { id: postId },
  });
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meQuery }] = useMeQuery();

  if (fetching) {
    return <Layout>Fetching...</Layout>;
  }

  if (!postQuery?.post) {
    return (
      <Layout>
        <Box>Not Found.</Box>
      </Layout>
    );
  }
  const isMyPost = meQuery?.me && postQuery.post.creator.id === meQuery.me.id;

  return (
    <Layout>
      <Flex p={5} shadow="md" borderWidth="1px">
        <Box flex={1}>
          <Flex>
            <Box>
              <Heading fontSize="xl">{postQuery.post.title}</Heading>
              <Text fontSize="xs">
                posted by {postQuery.post.creator.username}
              </Text>
            </Box>
            {isMyPost ? (
              <Box ml="auto">
                <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
                  <IconButton as={Link} icon="edit" aria-label="Edit Post" />
                </NextLink>
                <IconButton
                  ml={2}
                  icon="delete"
                  aria-label="Delete Post"
                  onClick={async () => {
                    await deletePost({ id: postId });
                    router.push("/");
                  }}
                />
              </Box>
            ) : null}
          </Flex>
          <Text mt={4}>{postQuery.post.text}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
