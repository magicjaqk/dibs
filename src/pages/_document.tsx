import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initalProps = await Document.getInitialProps(ctx);

    return initalProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/hand.png" type="image/png" />
          {/* <!-- Primary Meta Tags --> */}
          <meta name="title" content="Dibs!" />
          <meta
            name="description"
            content="We're moving! Take our stuff please!"
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://dibs.jaqk.coffee/" />
          <meta property="og:title" content="Dibs!" />
          <meta
            property="og:description"
            content="We're moving! Take our stuff please!"
          />
          <meta
            property="og:image"
            content="https://dibs.jaqk.coffee/meta-img.jpeg"
          />

          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://dibs.jaqk.coffee/" />
          <meta property="twitter:title" content="Dibs!" />
          <meta
            property="twitter:description"
            content="We're moving! Take our stuff please!"
          />
          <meta
            property="twitter:image"
            content="https://dibs.jaqk.coffee/meta-img.jpeg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
