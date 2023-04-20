import Head from "next/head";
import cloudinary from "../utils/cloudinary";
import type { ImageProps } from "../utils/types";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import Image from "next/image";

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${result.public_id}.${result.format}`,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}

export default function CloudinaryPage({ images }: { images: ImageProps[] }) {
  return (
    <div>
      <Head>
        <title>Jorge Venegas Photography</title>
        <meta name="description" content="A space for my photography hobby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center">
        <div className="mx-auto max-w-screen-2xl p-5 xl:px-10">
          <h1 className="text-4xl pb-10 font-thin">Example with Cloudinary</h1>
          <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {images.map(({ id, public_id, format, blurDataUrl, url }) => {
              return (
                <Image
                  key={id}
                  src={url}
                  alt={"Something"}
                  width={720}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
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
