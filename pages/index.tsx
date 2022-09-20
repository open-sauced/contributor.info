import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contributor Info</title>
        <meta name="description" content="Discover who is contributing to open-source." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Contributor Info</h1>

        <p className={styles.description}>Discover contributors to open-source projects!</p>

        <div className={styles.grid}>
          <div className="flex-col">
            <div className="mb-4 px-[15px] gap-x-[10px] py-[10px] justify-between bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-md md:min-w-[422px] flex">
              <input
                className="bg-white w-full outline-none text-base text-lightSlate"
                placeholder="Search repositories"
                type="text"
              />
            </div>

            <div className="flex">
              <button className="mr-2 bui-btn sbui-btn-primary sbui-btn-container--shadow sbui-btn--tiny undefined !text-sm !font-semibold !tracking-tight !py-1 !px-3 !rounded-md !px- focus-visible:!border-orange-500 focus:outline-none focus-visible:ring focus-visible:!ring-orange-200 !bg-orange-500 !border-orange-500 hover:!bg-orange-600 sbui-btn--text-align-center">
                <span>submit</span>
              </button>
              <button className="sbui-btn sbui-btn-link sbui-btn--tiny undefined !text-sm !font-semibold !tracking-tight !py-1 !px-3 !rounded-md !px- focus-visible:!border-orange-500 focus:outline-none focus-visible:ring focus-visible:!ring-orange-200 !text-orange-600 hover:!bg-orange-100 sbui-btn--text-align-center">{`I'm feeling lucky`}</button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
