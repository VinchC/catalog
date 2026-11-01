import type { Metadata } from "next";
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/providers/ThemeProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Catalog",
    template: "%s | Catalog",
  },
  description: "Un catalogue évolutif consacré à la musique et au cinéma.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Header />

          <main
            id="main-content"
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"
          >
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
