import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },

      // ✅ Cloudflare R2 (r2.dev)
      {
        protocol: "https",
        hostname: "pub-21ac384ecd8e4ec88d9c0d2834aa1d5f.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "58b1b748101fb8dce05a8a6f32f51343.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      // ✅ Placeholder domain used in API demo data
      {
        protocol: "https",
        hostname: "your-r2-domain",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
