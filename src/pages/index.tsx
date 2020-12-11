import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { EditDeleteButtons } from "components/EditDeleteButtons";
import { Layout } from "components/Layout";
import { UpdootSection } from "components/UpdootSection";
import { usePostsQuery } from "generated/graphql";
import NextLink from "next/link";
import React from "react";
import withApollo from "utils/withApollo";

const Index = () => {
  // pagination
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return <div> Error loading data...</div>;
  }

  if (loading && !data) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack spacing={8}>
        {data!.posts.posts.map((p) =>
          !p ? null : (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box flex={1}>
                <Flex>
                  <Box>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text fontSize="xs">posted by {p.creator.username}</Text>
                  </Box>
                  <EditDeleteButtons id={p.id} creatorId={p.creator.id} />
                </Flex>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
          )
        )}
      </Stack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
