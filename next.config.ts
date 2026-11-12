import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/realestate-firm",

  images: {
    unoptimized: true,
  },

  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.10", "192.168.1.11"],
};

export default nextConfig;