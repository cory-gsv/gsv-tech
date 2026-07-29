import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  serverExternalPackages: ["@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/network-report-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/services/managed-it/:city",
        destination: "/commercial-it-support-:city",
        permanent: true,
      },
      {
        source: "/services/networks-security-systems/:city",
        destination: "/commercial-it-support-:city",
        permanent: true,
      },
      {
        source: "/services/smart-home-automation/:city",
        destination: "/home-network-security-:city",
        permanent: true,
      },
      {
        source: "/services/audio-video-surveillance/:city",
        destination: "/home-network-security-:city",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
