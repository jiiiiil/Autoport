import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize PDF libraries for server components
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas'],
  // Add turbopack config to silence the error
  turbopack: {},
};

export default nextConfig;
