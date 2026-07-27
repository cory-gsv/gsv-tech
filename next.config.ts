import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.gsvisions.com",
          },
        ],
        destination: "https://gsvisions.com/:path*",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/#gsv-redesign-active-panel",
        permanent: true,
      },
      {
        source: "/billing",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/services/managed-it",
        destination: "/managed-it",
        permanent: true,
      },
      {
        source: "/services/networks-security-systems",
        destination: "/managed-it",
        permanent: true,
      },
      {
        source: "/services/smart-home-automation",
        destination: "/smart-home-automation",
        permanent: true,
      },
      {
        source: "/services/audio-video-surveillance",
        destination: "/smart-home-automation",
        permanent: true,
      },
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
