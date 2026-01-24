import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true  // Requis pour le mode export
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
