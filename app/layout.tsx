import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sea View Skydiving — Pattaya Tandem Jump | Greedy Adventures",
  description:
    "Defy gravity from 13,000 feet above the Gulf of Thailand. USPA-certified instructors, daily departures, and complete media packages.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas-off-white text-on-surface antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
