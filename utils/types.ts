export type EXIFInfo = {
  title: string;
  iso: number;
  fNumber: number;
  flashMode: number;
  focalLength: number;
  exposureTime: number;
};

export type Photo = {
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
