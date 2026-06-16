/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export → ./out (ready for S3). next/image needs unoptimized
  // because the Image Optimization API requires a running server.
  output: "export",
  // Clean static URLs for sub-routes like /contact (-> out/contact/index.html)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
