import Head from "next/head";
import Image from "next/image";
import type { InferGetStaticPropsType } from "next";
import { request } from "../lib/datocms";
import { useState } from "react";
import { EXIFInfo, Photo } from "../utils/types";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PHOTO_QUERY = `query images {
  allUploads (filter: { tags:{ eq: "x100v" }}) {
    id
    alt
    blurUpThumb
    exifInfo
    title
    width
    height
    url(imgixParams: {})
    responsiveImage {
      sizes
    }
  }
}`;

export async function getStaticProps() {
  let allUploads: Array<Photo> = [];
  const data = await request({
    query: PHOTO_QUERY,
    variables: { limit: 10 },
  });

  allUploads = data.allUploads;

  // allUploads = [allUploads[0], allUploads[1]];

  return {
    props: { allUploads },
  };
}

function EXIFInfo(props: EXIFInfo) {
  return (
    <div className="text-gray-100 font-mono p-3">
      <div className="table w-full text-xs">
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

type PhotoProps = {
  photo: Photo;
  onPhotoClick: (p: Photo) => void;
};

function Photo({ photo, onPhotoClick }: PhotoProps) {
  return (
    <Image
      key={photo.id}
      src={`${photo.url}`}
      alt={photo.title || "Photo by Jorge Venegas"}
      onClick={() => onPhotoClick(photo)}
      placeholder="blur"
      blurDataURL={photo.blurUpThumb}
      width={photo.height}
      height={photo.width}
      loading="lazy"
      sizes="
      (max-width: 640px) 50vw,
      (max-width: 768px) 20vw,
      (max-width: 1024px) 20vw,
      20vw"
      style={{
        objectFit: "cover",
        transform: "translate3d(0, 0, 0)",
      }}
      className="rounded-lg object-cover object-center brightness-100 transition hover:brightness-110 hover:cursor-pointer grow h-full mb-4"
    />
  );
}

type HighlightProps = {
  photo: Photo;
  onClick: () => void;
};

function Highlight({ photo: p, onClick }: HighlightProps) {
  const [hovered, setHovered] = useState(false);

  const toggleHovered = () => {
    setHovered((hovered) => !hovered);
  };

  return (
    <div
      className="fixed flex backdrop-blur bg-black/50 z-10 h-full w-full left-0 top-0 overflow-y-auto flex-wrap content-center justify-center"
      onClick={() => onClick()}
    >
      <div
        className="h-5/6 w-fit bg-white relative"
        onMouseEnter={toggleHovered}
        onMouseLeave={toggleHovered}
      >
        <Image
          src={p.url}
          alt={p.title || "Photo by Jorge Venegas"}
          placeholder="blur"
          blurDataURL={p.blurUpThumb}
          width={p.width}
          height={p.height}
          style={{
            width: "auto",
            height: "100%",
          }}
          className="p-3"
        />
        {hovered && (
          <div className="h-fit absolute left-0 right-0 bottom-0 backdrop-blur bg-black/50 flex m-3">
            <div className="w-1/3">
              <EXIFInfo {...p.exifInfo} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home({ allUploads }: PageProps) {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const onPhotoClick = (p: Photo) => {
    setActivePhoto(p);
    setIsOpen(true);
  };

  const onClose = () => {
    setActivePhoto(null);
    setIsOpen(false);
  };

  return (
    <div>
      <Head>
        <title>Jorge Venegas – Photography portolio</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <div className="py-10">
            <h1 className="text-4xl pb-10 font-thin">
              Jorge Venegas – Photography portfolio
            </h1>
            <p>
              Photography is a hobby that keeps me connected to surroundings by
              keeping attention to small details, light, shades and shapes.
              <br />
              Most of my photos are taken with a Fujifilm X100V.
            </p>
          </div>
          {activePhoto && <Highlight photo={activePhoto} onClick={onClose} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allUploads.map((p, i) => (
              <Photo key={p.id} photo={p} onPhotoClick={onPhotoClick} />
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-1 py-5 border-t border-gray-200 items-center justify-center">
        <a
          href="https://jorgepvenegas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 hover:font-bold"
        >
          Jorge Venegas{" "}
        </a>
      </footer>
    </div>
  );
}
