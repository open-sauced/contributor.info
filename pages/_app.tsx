import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from "next/router";
import Head from "next/head";
import { SWRConfig } from "swr";
import apiFetcher from "../hooks/useSWR";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { owner, repo } = router.query;

  return (
    <>
      <Head>
        <title>Contributor Info{owner && ` - ${owner}/${repo}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SWRConfig
        value={{
          revalidateOnFocus: false,
          fetcher: apiFetcher
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>

    </>
  );
}

export default App
