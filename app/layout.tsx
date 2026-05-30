import type { Metadata } from "next";
import "./globals.css";
import MenuAutoClose from "./components/MenuAutoClose";

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
      <body><MenuAutoClose />
        {children}</body>
    </html>
  );
}
