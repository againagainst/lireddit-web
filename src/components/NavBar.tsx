import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching: loginFetching }] = useMeQuery();

  let body = null;

  if (!loginFetching) {
    if (data?.me) {
      body = (
        <Flex>
          <Box marginRight={2}>{data.me.username}</Box>
          <Button
            onClick={() => {
              logout();
            }}
            isLoading={logoutFetching}
            variant="link"
          >
            Logout
          </Button>
        </Flex>
      );
    } else {
      body = (
        <>
          <NextLink href="/login">
            <Link color="white" marginRight={2}>
              Login
            </Link>
          </NextLink>
          <NextLink href="/register">
            <Link color="white">Register</Link>
          </NextLink>
        </>
      );
    }
  }
  return (
    <Flex bg="MediumSeaGreen" padding={4}>
      <Box marginLeft={"auto"}>{body}</Box>
    </Flex>
  );
};
