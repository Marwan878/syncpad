// Clerk
import { ClerkProvider } from "@clerk/nextjs";

// Next
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// React Hot Toast
import { Toaster } from "react-hot-toast";

// CSS
import "./globals.css";

// Components
import Navbar from "@/components/main-layout/navbar";

// Tanstack Query
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncPad",
  description: "SyncPad is an online collaborative editor",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReactQueryProvider>
            <EdgeStoreProvider>
              <Toaster />
              <Navbar />

              <main>{children}</main>
            </EdgeStoreProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
