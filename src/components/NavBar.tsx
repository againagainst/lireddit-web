import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching: loginFetching }] = useMeQuery({
    pause: isServer(), // Disable SSR for the NavBar
  });

  let body = null;

  if (!loginFetching) {
    if (data?.me) {
      body = (
        <Flex align="center">
          <NextLink href="/create-post ">
            <Button mr={4}>Create Post</Button>
          </NextLink>
          <Box mr={4}>{data.me.username}</Box>
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
    <Flex zIndex={1} position="sticky" top={0} bg="MediumSeaGreen" padding={4}>
      <Flex flex={1} margin="auto" maxW={800} align="center">
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box marginLeft={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
