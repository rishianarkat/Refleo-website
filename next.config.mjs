import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

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
  // @shadergradient/react exports only an "import" condition, which Next 14's
  // webpack resolver doesn't match. Point straight at the ESM entry.
  webpack(config) {
    config.resolve.alias["@shadergradient/react$"] = path.join(
      here,
      "node_modules/@shadergradient/react/dist/index.mjs"
    );
    return config;
  },
};

export default nextConfig;
