import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const Post = ({}) => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { id: postId },
  });

  if (fetching) {
    return <Layout>Fetching...</Layout>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Not Found.</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex p={5} shadow="md" borderWidth="1px">
        <Box>
          <Heading fontSize="xl">{data.post.title}</Heading>
          <Text fontSize="xs">posted by {data.post.creator.username}</Text>
          <Text mt={4}>{data.post.text}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
