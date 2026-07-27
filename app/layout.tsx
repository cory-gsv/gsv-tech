import type { Metadata, Viewport } from "next";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import MenuAutoClose from "./components/MenuAutoClose";
import SiteChatWidget from "./components/SiteChatWidget";
import { siteUrl } from "./config/site";
import { globalStructuredData } from "./data/structuredData";

const socialImage = "/images/gsv-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Golden State Visions",
  title: "Managed IT & Smart Home Services | Golden State Visions",
  description:
    "Managed IT, secure business networks, smart home automation, audio/video, and surveillance solutions for Northern California businesses and homeowners.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "Managed IT & Smart Home Services | Golden State Visions",
    description:
      "Comprehensive IT support, enterprise-grade network deployments, premium smart home integration, audio video systems, and surveillance solutions built for long-term reliability.",
    url: "/",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1798,
        height: 877,
        alt: "Golden State Visions managed IT, network, smart home, and audio video services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@techgsvisions",
    title: "Managed IT & Smart Home Services | Golden State Visions",
    description:
      "Managed IT support, secure business networks, smart home automation, audio video systems, and surveillance solutions for Northern California.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MenuAutoClose />
        <JsonLd data={globalStructuredData()} />
        {children}
        <SiteChatWidget />
      </body>
    </html>
  );
}
