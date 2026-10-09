import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  experimental: { viewTransition: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
