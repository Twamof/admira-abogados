import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/admira-abogados",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
