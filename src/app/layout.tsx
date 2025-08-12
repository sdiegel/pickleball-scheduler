import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SupabaseProvider from '@/components/SupabaseProvider'; 
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import './globals.css';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pickleball Scheduler",
  description: "Schedule and join pickleball matches",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Script id="theme-init" strategy="beforeInteractive">{`
    (function(){
      try {
        var storageKey = 'prefers-dark';
        var stored = localStorage.getItem(storageKey);
        var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var enable = stored === 'true' || (stored === null && prefers);
        if (enable) document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `}</Script>
        <SupabaseProvider>
          <Header />

          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}