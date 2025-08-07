import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../components/dashboard.css";
import "../components/inquiries.css";
import "../components/login.css";
import "../components/styles.css";
import "../components/navbar.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Propwise.lk",
  description: "Designed and Created by fusionlabz.lk",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "PROPWISE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}