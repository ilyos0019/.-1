import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Usta kerakmi? Ishonchli usta topish | Findmaster.uz",
  description: "Findmaster.uz orqali uyingiz uchun malakali santexnik, tajribali elektrik va boshqa mutaxassislarni tez va oson toping. Sizga zudlik bilan usta kerak bo'lsa, biz yordam beramiz!",
  keywords: ["usta kerak", "santexnik", "elektrik", "usta topish", "usta xizmatlari", "remont", "toshkent usta"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Findmaster.uz",
  },
  alternates: {
    canonical: 'https://findmaster.uz/',
  },
  openGraph: {
    title: 'Usta kerakmi? Ishonchli usta topish | Findmaster.uz',
    description: 'Santexnik, elektrik va boshqa malakali ustalarni bitta platformadan toping.',
    url: 'https://findmaster.uz',
    siteName: 'Findmaster.uz',
    images: [
      {
        url: 'https://findmaster.uz/images/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Findmaster.uz - Usta topish platformasi',
      },
    ],
    locale: 'uz_UZ',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
