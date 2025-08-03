// Clerk
import { ClerkProvider } from "@clerk/nextjs";

// Uploadthing
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

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
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <Toaster />
            <Navbar />

            <main>{children}</main>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
