import Head from "next/head";
import Image from "next/image";
import type { InferGetStaticPropsType } from "next";
import { request } from "../lib/datocms";
import { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "15px",
    background: "none",
    border: 0,
  },
};

Modal.setAppElement("#__next");

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PHOTO_QUERY = `query images {
  allUploads (filter: { tags:{ eq: "x100v" }}) {
    id
    alt
    blurUpThumb
    exifInfo
    title
    url(imgixParams: {})
  }
}`;

export async function getStaticProps() {
  let allUploads: Array<PhotoProps> = [];
  const data = await request({
    query: PHOTO_QUERY,
    variables: { limit: 10 },
  });

  allUploads = data.allUploads;

  return {
    props: { allUploads },
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
  id: string;
  alt: string;
  blurUpThumb: string;
  exifInfo: EXIFInfoProps;
  title: string;
  url: string;
};

function EXIFInfo(props: EXIFInfoProps) {
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
        alt={p.title || "Photo by Jorge Venegas"}
        width={720}
        placeholder="blur"
        blurDataURL={p.blurUpThumb}
        height={600}
        loading="lazy"
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
  onClick: () => void;
};

function Highlight({ photo: p }: HighlightProps) {
  return (
    <div className="container w-fit mx-auto">
      <Image
        src={p.url}
        alt={p.title || "Photo by Jorge Venegas"}
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
      <div className="backdrop-blur bg-black/50 rounded-b-lg flex">
        <div className="w-1/3">
          <EXIFInfo {...p.exifInfo} />
        </div>
      </div>
    </div>
  );
}

export default function DatoCMSPage({ allUploads }: PageProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoProps | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const onPhotoClick = (p: PhotoProps) => {
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
        <div className="h-screen mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with DatoCMS</h1>
          {activePhoto && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={onClose}
              style={customStyles}
              contentLabel="Highlight"
            >
              <Highlight photo={activePhoto} onClick={onClose} />
            </Modal>
          )}
          <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
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
