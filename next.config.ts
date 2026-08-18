import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.11"],
};

export default nextConfig;