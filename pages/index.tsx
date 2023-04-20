import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import type { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import { createClient } from "../prismicio";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticProps({ previewData }: GetStaticPropsContext) {
  const client = createClient({ previewData });

  const page = await client.getByType("photography");
  return {
    props: {
      page,
    },
  };
}

export default function Home({ page }: PageProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-3xl">
          Photos by <a href="https://jorgepvenegas.com">Jorge</a>
        </h1>

        <div className={styles.grid}>
          <div className="container mx-auto px-5 py-2">
            <div className="flex flex-wrap md:-m-2">
              {page.results.map((p, i) => (
                <div key={i} className="flex w-1/4 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <Image
                      src={p.data.image.url}
                      alt={p.data.image.alt}
                      width={720}
                      height={480}
                      sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                      style={{
                        objectFit: "cover",
                        transform: "translate3d(0, 0, 0)",
                      }}
                      className="block h-full w-full rounded-lg object-cover object-center brightness-100 transition hover:brightness-110"
                    />
                  </div>
                </div>
              ))}
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
}
