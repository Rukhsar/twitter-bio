import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="description"
                        content="Revolutionize your twitter presence with ai-generated bios."
                    />
                    <meta property="og:site_name" content="twitterbio.com" />
                    <meta
                        property="og:description"
                        content="Revolutionize your twitter presence with ai-generated bios."
                    />
                    <meta
                        property="og:title"
                        content="Revolutionize your twitter presence with ai-generated bios"
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <body className="bg-gray-900 text-gray-100">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
