import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import SupabaseProvider from '@/components/SupabaseProvider'; 
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";

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
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SupabaseProvider>
          <Header />

          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}