import { Box, Button, Flex } from "@chakra-ui/core";
import { InputField } from "components/InputField";
import { Layout } from "components/Layout";
import { Form, Formik } from "formik";
import { useCreatePostMutation } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { createUrqlClient } from "utils/createUrqlClient";
import { useIsAuth } from "utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="What are you thinking about?"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                label="Body"
                placeholder="Your post..."
              />
            </Box>
            <Flex alignItems="baseline" mt={4}>
              <Button
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
