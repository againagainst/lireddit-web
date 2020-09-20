import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import Head from "next/head";
import React from "react";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Lireddit</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
