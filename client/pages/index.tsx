import Head from "next/head";
import Dropzone from "../containers/Dropzone/Dropzone";
import Main from "../containers/Main/Main";

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Facify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="App">
        <Main></Main>
        <Dropzone></Dropzone>
      </div>
    </>
  );
}
