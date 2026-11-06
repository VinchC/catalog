import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/config/site";

import "./globals.css";
import SkipLink from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        <ThemeProvider>
          <Suspense
            fallback={
              <header className="border-b border-border" aria-hidden="true">
                <div className="mx-auto max-w-6xl px-4 py-4">
                  <div className="flex min-h-7 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
                    {/* Emplacement du nom du site */}
                    <div className="h-6 w-24 rounded bg-foreground/10" />

                    {/* Emplacement de la navigation desktop */}
                    <div className="hidden h-5 w-64 rounded bg-foreground/10 md:block" />

                    {/* Emplacement du menu mobile */}
                    <div className="h-8 w-8 rounded bg-foreground/10 md:hidden" />

                    {/* Emplacement des actions desktop */}
                    <div className="hidden h-8 w-32 justify-self-end rounded bg-foreground/10 md:block" />
                  </div>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>

          <main
            id="main-content"
            tabIndex={-1}
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
