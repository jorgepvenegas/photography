/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
        port: "",
        pathname: "/jorgepvenegas/**",
      },
      {
        protocol: "https",
        hostname: "www.datocms-assets.com",
      },
    ],
  },
  typescript: {
    // TODO: OH NOES
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
