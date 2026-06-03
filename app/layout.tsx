import type { Metadata } from "next";
import "./globals.css";
import MenuAutoClose from "./components/MenuAutoClose";
import { siteUrl } from "./config/site";

const socialImage = "/assets/images/portfolio/network-services-infographic-even.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "GSV Stack",
  title: "Managed IT Services & Business Infrastructure | GSV Stack",
  description:
    "GSV Stack delivers managed IT support, secure business networks, cloud workspace administration, endpoint protection, and business automation for Northern California organizations.",
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
    title: "Managed IT Services & Business Infrastructure | GSV Stack",
    description:
      "Managed IT support, secure network deployments, cloud workspace administration, endpoint protection, procurement, and business automation built for long-term reliability.",
    url: "/",
    siteName: "GSV Stack",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 1600,
        alt: "Structured network cabling and rack infrastructure by GSV Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed IT Services & Business Infrastructure | GSV Stack",
    description:
      "Managed IT support, secure business networks, cloud workspace administration, endpoint protection, and business automation for Northern California.",
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
