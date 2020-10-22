import { Box, Button, Flex } from "@chakra-ui/core";
import { InputField } from "components/InputField";
import { Layout } from "components/Layout";
import { Form, Formik } from "formik";
import { usePostQuery, useUpdatePostMutation } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { createUrqlClient } from "utils/createUrqlClient";
import { useIsAuth } from "utils/useIsAuth";

const EditPost: React.FC<{}> = ({}) => {
  useIsAuth();

  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { id: postId },
  });
  const [, updatePost] = useUpdatePostMutation();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { error } = await updatePost({
            id: postId,
            title: values.title,
            text: values.text,
          });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" />
            <Box mt={4}>
              <InputField textarea name="text" label="Body" />
            </Box>
            <Flex alignItems="baseline" mt={4}>
              <Button
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                Edit Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(EditPost);
