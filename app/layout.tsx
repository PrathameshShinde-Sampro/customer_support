import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Support Ticket System",
  description: "Manage your support tickets efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SupportHub Ticket Management System
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
