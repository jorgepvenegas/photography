import Head from "next/head";
import Image from "next/image";
import type { InferGetStaticPropsType } from "next";
import { request } from "../lib/datocms";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

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
  let allUploads: Array<Image> = [];
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

type EXIFInfo = {
  title: string;
  iso: number;
  fNumber: number;
  flashMode: number;
  focalLength: number;
  exposureTime: number;
};

type ResponsiveImage = {
  sizes: string;
};

type Image = {
  id: string;
  alt: string;
  blurUpThumb: string;
  exifInfo: EXIFInfo;
  responsiveImage: ResponsiveImage;
  title: string;
  width: number;
  height: number;
  url: string;
};

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
  photo: Image;
  onPhotoClick: (p: Image) => void;
};

function Photo({ photo, onPhotoClick }: PhotoProps) {
  // return <img src={`${photo.url}`} />;
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
  photo: Image;
  onClick: () => void;
};

function Highlight({ photo: p, onClick }: HighlightProps) {
  return (
    <div className="container w-fit relative">
      <Image
        src={p.url}
        alt={p.title || "Photo by Jorge Venegas"}
        placeholder="blur"
        blurDataURL={p.blurUpThumb}
        width={p.width}
        height={p.height}
        sizes="50vw"
        style={{
          transform: "translate3d(0, 0, 0)",
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
          width: "100%",
          height: "auto",
        }}
        className="rounded-lg brightness-100 transition hover:cursor-pointer"
      />
      {/* <div className="h-1/6 backdrop-blur bg-black/50 rounded-b-lg flex">
          <div className="w-1/3">
            <EXIFInfo {...p.exifInfo} />
          </div>
        </div> */}
    </div>
  );
}

export default function DatoCMSPage({ allUploads }: PageProps) {
  const [activePhoto, setActivePhoto] = useState<Image | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const onPhotoClick = (p: Image) => {
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
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with DatoCMS</h1>
          {activePhoto && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={onClose}
              contentLabel="Highlight"
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            >
              <Highlight photo={activePhoto} onClick={onClose} />
            </Modal>
          )}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
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
        >
          Jorge Venegas{" "}
        </a>
      </footer>
    </div>
  );
}
