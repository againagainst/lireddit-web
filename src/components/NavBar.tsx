import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (!fetching) {
    if (data?.me) {
      body = (
        <Flex>
          <Box marginRight={2}>{data.me.username}</Box>
          <Button variant="link">Logout</Button>
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
