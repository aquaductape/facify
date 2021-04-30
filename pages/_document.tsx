import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#224aff" />
          <meta name="msapplication-TileColor" content="#224aff" />
          <meta name="theme-color" content="#224aff" />
          {/* <!-- Open Graph Protocol --> */}
          <meta property="og:title" content="Facify" />
          <meta property="og:image" content="/og-image-facify.png" />
          <meta property="og:image:alt" content="Find Faces within photos" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://facify.vercel.app/" />
          <meta property="og:description" content="Find Faces within photos" />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Facify" />
          <meta name="twitter:description" content="Find Faces within photos" />
          <meta
            name="twitter:image"
            content="https://facify.vercel.app/og-image-facify.png"
          />
          <meta name="twitter:image:alt" content="Find Faces within photos" />
        </Head>

        <body data-scroll>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
