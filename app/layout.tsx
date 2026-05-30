import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managed IT Services & Smart Home Automation | Golden State Visions",
  description: "Managed IT support, secure business networks, smart home automation, audio video systems, and surveillance solutions for businesses and homes in Northern California.",
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
