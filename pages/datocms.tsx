import Head from "next/head";
import Image from "next/image";
import type { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import { request } from "../lib/datocms";
import { useEffect, useState } from "react";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PHOTO_QUERY = `query images {
  allUploads (filter: { tags:{ eq: "x100v" }}) {
    blurUpThumb
    url(imgixParams: {})
    id
    exifInfo
    alt
    title
  }
}`;

export async function getStaticProps() {
  const data = await request({
    query: PHOTO_QUERY,
    variables: { limit: 10 },
  });
  return {
    props: { data },
  };
}

type EXIFInfoProps = {
  title: string;
  hovered: boolean;
  iso: number;
  fNumber: number;
  flashMode: number;
  focalLength: number;
  exposureTime: number;
};

type PhotoProps = {
  title: string;
  iso: number;
  fNumber: number;
  flashMode: number;
  focalLength: number;
  exposureTime: number;
};

function EXIFInfo(props: EXIFInfoProps) {
  return (
    <div className="absolute bottom-0 left-0 w-full backdrop-blur bg-black/30 p-3 rounded-b-lg text-white font-mono">
      {!props.hovered && <h3>{props.title}</h3>}
      {props.hovered && (
        <div className="table w-full text-sm">
          <div className="table-row">
            <div className="table-cell">ISO:</div>
            <div className="table-cell">{props.iso}</div>
          </div>
          <div className="table-row">
            <div className="table-cell">Aperture:</div>
            <div className="table-cell">ƒ/{props.fNumber}</div>
          </div>
          <div className="table-row">
            <div className="table-cell">Flash:</div>
            <div className="table-cell">{props.flashMode}</div>
          </div>
          <div className="table-row">
            <div className="table-cell">Focal Length:</div>
            <div className="table-cell">{props.focalLength}mm</div>
          </div>
          <div className="table-row">
            <div className="table-cell">Exposure:</div>
            <div className="table-cell">
              1/{Math.round(1 / props.exposureTime)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TODO: Oh no so ugly.
function Photo({ photo: p }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      key={p.id}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={p.url}
        alt={p.filename}
        width={720}
        placeholder="blur"
        blurDataURL={p.blurUpThumb}
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
      <EXIFInfo title={p.title} hovered={hovered} {...p.exifInfo} />
    </div>
  );
}

export default function DatoCMSPage({ data }: PageProps) {
  return (
    <div>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with DatoCMS</h1>
          <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {data.allUploads.map((p, i) => {
              return <Photo key={p.id} photo={p} />;
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
