import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GSV Tech | Business IT, Networking & Smart Home Systems",
  description:
    "GSV Tech provides business IT support, network infrastructure, UniFi deployments, and smart home systems including Lutron HomeWorks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}