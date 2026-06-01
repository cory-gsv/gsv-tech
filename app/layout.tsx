import type { Metadata } from "next";
import "./globals.css";
import MenuAutoClose from "./components/MenuAutoClose";

const siteUrl = "https://tech.gsvisions.com";
const socialImage = "/assets/images/portfolio/network-services-infographic-even.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Golden State Visions",
  title: "Managed IT Services & Smart Home Automation | Golden State Visions",
  description:
    "Golden State Visions delivers managed IT support, secure business networks, smart home automation, audio video systems, and surveillance solutions for businesses and homes in Northern California.",
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
    title: "Managed IT Services & Smart Home Automation | Golden State Visions",
    description:
      "Comprehensive IT support, enterprise-grade network deployments, premium smart home integration, audio video systems, and surveillance solutions built for long-term reliability.",
    url: "/",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 1600,
        alt: "Structured network cabling and rack infrastructure by Golden State Visions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed IT Services & Smart Home Automation | Golden State Visions",
    description:
      "Managed IT support, secure business networks, smart home automation, audio video systems, and surveillance solutions for Northern California.",
    images: [socialImage],
  },
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
        {children}
      </body>
    </html>
  );
}
