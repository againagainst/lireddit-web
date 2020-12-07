import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { EditDeleteButtons } from "components/EditDeleteButtons";
import React from "react";
import { useGetPostFromUrl } from "utils/useGetPostFromUrl";
import { withApollo } from "utils/withApollo";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";

export const Post = ({}) => {
  const postId = useGetPostFromUrl();
  const { data: postQuery, loading } = usePostQuery({
    skip: postId === -1,
    variables: { id: postId },
  });

  if (loading) {
    return <Layout>Fetching...</Layout>;
  }

  if (!postQuery?.post) {
    return (
      <Layout>
        <Box>Not Found.</Box>
      </Layout>
    );
  }

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
            <Box ml="auto">
              <EditDeleteButtons
                id={postId}
                creatorId={postQuery.post.creator.id}
              />
            </Box>
          </Flex>
          <Text mt={4}>{postQuery.post.text}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
