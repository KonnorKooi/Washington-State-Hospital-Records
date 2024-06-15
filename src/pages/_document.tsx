// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Include other meta tags or links if necessary */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
