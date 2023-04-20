import { createClient } from "../prismicio";
import Head from "next/head";
import Image from "next/image";
import sm from "./../sm.json";

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });

  const page = await client.getByType("photography");
  return {
    props: {
      page,
    },
  };
}

export default function About({ page }) {
  return (
    <div>
      <h1 className="text-4xl">Photos</h1>
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
  );
}
