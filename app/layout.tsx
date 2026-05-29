import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managed IT Services & Smart Home Automation | Lincoln, CA",
  description:
    "Golden State Visions provides managed IT services, business network infrastructure, UniFi deployments, smart home integration, and technology procurement for Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region. Call (916) 432-3373.",
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
