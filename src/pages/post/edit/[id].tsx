import { Box, Button, Flex } from "@chakra-ui/core";
import { InputField } from "components/InputField";
import { Layout } from "components/Layout";
import { Form, Formik } from "formik";
import { usePostQuery, useUpdatePostMutation } from "generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useGetPostFromUrl } from "utils/useGetPostFromUrl";
import { useIsAuth } from "utils/useIsAuth";
import withApollo from "utils/withApollo";

const EditPost: React.FC<{}> = ({}) => {
  useIsAuth();

  const router = useRouter();
  const postId = useGetPostFromUrl();
  const { data, loading } = usePostQuery({
    skip: postId === -1,
    variables: { id: postId },
  });
  const [updatePost] = useUpdatePostMutation();

  if (loading) {
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
          const { errors } = await updatePost({
            variables: { id: postId, ...values },
          });
          if (!errors) {
            router.back();
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

export default withApollo({ ssr: false })(EditPost);
