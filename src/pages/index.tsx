import Head from "next/head";
import { NavBar } from "../components/NavBar";

const Index = () => (
  <>
    <Head>
      <title>Lireddit</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <NavBar />
    <div>hello world</div>
  </>
);

export default Index;
