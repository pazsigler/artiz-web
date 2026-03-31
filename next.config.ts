import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yjwwcynahsydscgsopqq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
