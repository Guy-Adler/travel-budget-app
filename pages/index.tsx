import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const App = dynamic(() => import('../src/App'), { ssr: false });

const Home: NextPage = () => (
  <>
    <Head>
      <meta name="referrer" content="no-referrer" /> {/* https://github.com/chakra-ui/chakra-ui/issues/5909 */}
    </Head>
    <App />
  </>
);

export default Home;
