import Head from "next/head";
import Image from "next/image";
import type { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import { createClient } from "../prismicio";
import Link from "next/link";

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
    <div>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <div className="flex gap-3">
            <Link href="/prismic">
              <h3 className="p-3 rounded-sm text-slate-800 font-normal font-mono text-sm hover:bg-slate-200">
                Prismic
              </h3>
            </Link>
            <Link href="/datocms">
              <h3 className="p-3 rounded-sm text-slate-800 font-normal font-mono text-sm hover:bg-slate-200">
                DatoCMS
              </h3>
            </Link>
          </div>
        </div>
      </main>

      <footer className="flex flex-1 py-5 border-t border-gray-200 items-center justify-center">
        <a
          href="https://jorgepvenegas.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jorge Venegas{" "}
        </a>
      </footer>
    </div>
  );
}
