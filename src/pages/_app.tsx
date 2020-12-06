import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import Head from "next/head";
import React from "react";
import theme from "theme";

const client = createApolloClient();

function createApolloClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    cache: new InMemoryCache(),
  });
}

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Lireddit</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
