import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta property="og:title" content="라디오" />
        <meta property="og:description" content="언제 어디서나 국내 라디오를 한번에" />
        <meta property="og:url" content="https://radio.yuntae.in" />
        <meta property="og:image" content="/opengraph.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7178712602934912"
          crossorigin="anonymous"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
