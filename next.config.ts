import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from walking up to ~/Documents (stray package-lock.json there).
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/stock/:slug",
        destination: "/vehicules/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
