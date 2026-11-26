import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
