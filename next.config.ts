import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    // GitHub Pages cannot run the Next.js image optimization server.
    unoptimized: true,
    formats: ["image/webp"],
    deviceSizes: [390, 430, 768, 1024, 1280, 1440, 1920, 2560],
    qualities: [75, 85, 90, 92, 94, 95],
  },
};

export default nextConfig;
