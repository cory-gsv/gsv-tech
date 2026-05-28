import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golden State Visions | Business IT, Networking & Smart Home Systems",
  description:
    "Golden State Visions provides business IT support, network infrastructure, UniFi deployments, and smart home systems including Lutron HomeWorks.",
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