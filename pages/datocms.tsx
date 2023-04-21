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
    <div className="backdrop-blur bg-black/50 rounded-b-lg text-gray-100 font-mono p-3">
      <div className="table text-xs">
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
    </div>
  );
}

// TODO: Oh no so ugly.
function Photo({ photo: p, onPhotoClick }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      key={p.id}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPhotoClick(p)}
    >
      <Image
        src={p.url}
        alt={p.filename}
        width={720}
        placeholder="blur"
        blurDataURL={p.blurUpThumb}
        height={200}
        sizes="(max-width: 640px) 100vw,
                    (max-width: 1280px) 50vw,
                    (max-width: 1536px) 33vw,
                    25vw"
        style={{
          objectFit: "cover",
          transform: "translate3d(0, 0, 0)",
        }}
        className="rounded-lg object-cover object-center brightness-100 transition hover:brightness-110 hover:cursor-pointer grow h-full"
      />
    </div>
  );
}

type HighlightProps = {
  photo: PhotoProps;
  onClose: () => void;
};

function Highlight({ photo: p, onClose }: HighlightProps) {
  return (
    <div
      className="flex flex-col mb-10 h-5/6 items-center align-middle"
      onClick={() => onClose()}
    >
      <div>
        <Image
          src={p.url}
          alt={p.title}
          width={720}
          placeholder="blur"
          blurDataURL={p.blurUpThumb}
          height={200}
          sizes="25vw"
          style={{
            objectFit: "cover",
            transform: "translate3d(0, 0, 0)",
          }}
          className="h-5/6 rounded-t-lg brightness-100 transition hover:cursor-pointer"
        />
        <div className="h-1/6">
          <EXIFInfo title={p.title} {...p.exifInfo} />
        </div>
      </div>
    </div>
  );
}

export default function DatoCMSPage({ data }: PageProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoProps | null>(null);

  const onPhotoClick = (p: PhotoProps) => {
    console.log("onPhotoClick", p);
    setActivePhoto(p);
  };

  const onClose = () => {
    setActivePhoto(null);
  };
  return (
    <div>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center">
        <div className="h-screen mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with DatoCMS</h1>
          {activePhoto && <Highlight photo={activePhoto} onClose={onClose} />}
          <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {data.allUploads.map((p, i) => {
              return <Photo key={p.id} photo={p} onPhotoClick={onPhotoClick} />;
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
