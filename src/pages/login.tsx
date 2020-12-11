import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { InputField } from "components/InputField";
import { Wrapper } from "components/Wrapper";
import { Form, Formik } from "formik";
import { MeDocument, MeQuery, useLoginMutation } from "generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { getStringOrElse } from "utils/getStringOrElse";
import { toErrorMap } from "utils/toErrorMap";
import withApollo from "utils/withApollo";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const apolloClient = useApolloClient();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push(getStringOrElse(router.query.next, "/"));
            apolloClient.resetStore();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex alignItems="baseline" mt={4}>
              <Button
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                Login
              </Button>
              <NextLink href="/forgot-password">
                <Link ml="auto"> Forgot password?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
