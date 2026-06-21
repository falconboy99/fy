import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Noto_Sans_Devanagari } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Sanatan Knowledge Archive",
  description:
    "A dynamic spiritual digital library for the four Vedas and eighteen Mahapuranas with immersive reading, discovery, and resource management.",
  keywords: [
    "Vedas",
    "Mahapurana",
    "Hindu scriptures",
    "Sanatan",
    "digital library",
    "Sanskrit",
  ],
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${devanagari.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
