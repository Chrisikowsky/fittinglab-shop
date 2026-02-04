import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FittingLab - Future of Hearing",
  description: "Exklusive Tech-Lösungen für Akustiker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="light">
      <body className={`${inter.className} antialiased selection:bg-[#329ebf]/30 selection:text-[#329ebf]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
