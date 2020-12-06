import { Box, Button } from "@chakra-ui/core";
import { InputField } from "components/InputField";
import { Wrapper } from "components/Wrapper";
import { Form, Formik } from "formik";
import { useForgotPasswordMutation } from "generated/graphql";
import React, { useState } from "react";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Please check your email.</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Box alignContent="right" mt={4}>
                <Button
                  type="submit"
                  variantColor="teal"
                  isLoading={isSubmitting}
                >
                  Reset Password
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
