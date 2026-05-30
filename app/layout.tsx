import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bespoke Technology Architecture & Management | Golden State Visions",
  description:
    "We design, install, and support premium technology frameworks for luxury residences and modern businesses. Engineered for performance, security, and absolute privacy.",
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
