import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../components/dashboard.css";
import "../components/inquiries.css";
import "../components/login.css";
import "../components/styles.css";

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