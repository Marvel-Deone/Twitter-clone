import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import styles from '../styles/Home.module.css';
import { getSession, getProviders, useSession } from "next-auth/react";
import Login from '../components/Login';
import Modal from '../components/Modal';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import Widgets from '../components/Widgets';

export default function Home({trendingResults,followResults,providers}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return <Login providers={providers} />; 
  return (
    <div className={styles.container}>
      <Head>
        <title>FMARK / Twitter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className='bg-[#000] min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar /> 
        <Feed />
        <Widgets trendingResults={trendingResults}
          followResults={followResults}/>
        {isOpen && <Modal />}
        {/* {session.user.name} */}
      </main>

    </div>
  )
}

export async function getServerSideProps(ctx) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  return {
    props: {
      trendingResults,
      followResults,
      providers: await getProviders(),
      session: await getSession(ctx),
    }
  };
}