import Head from "next/head";
import Image from "next/image";
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

export default function PrismicPage({ page }: PageProps) {
  return (
    <div>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with Prismic</h1>
          <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {page.results.map((p, i) => {
              return (
                <div key={p.id} className="relative">
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
                    className="rounded-lg object-cover object-center brightness-100 transition hover:brightness-110 grow h-full"
                  />
                  <div className="absolute bottom-0 left-0 w-full">
                    <h3 className=" backdrop-blur bg-white/20 p-3 rounded-b-lg text-white font-normal font-mono text-sm">
                      {p.data.image.alt || "None"}
                    </h3>
                  </div>
                </div>
              );
            })}
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
