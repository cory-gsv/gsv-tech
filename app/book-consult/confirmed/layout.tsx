import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Booking Confirmed | Golden State Visions",
  description: "Golden State Visions consultation booking confirmation.",
  alternates: {
    canonical: "/book-consult/confirmed",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingConfirmedLayout({ children }: { children: ReactNode }) {
  return children;
}

