import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { LogoIntro } from "@/components/layout/LogoIntro";
import { routing } from "@/i18n/routing";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduExpert — Study Abroad & Visa Consulting",
  description:
    "Expert guidance for a seamless study abroad journey. Personalised consultation, visa & documentation assistance, and cultural & academic support.",
  metadataBase: new URL("https://eduexpert.in"),
};

export const viewport: Viewport = {
  themeColor: "#0a0f2e",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${inter.variable} antialiased bg-[var(--color-background)]`}
    >
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-fg)] flex flex-col">
        <NextIntlClientProvider>
          <MotionProvider>
            <LogoIntro />
            <Navbar />
            <main className="flex-1 flex flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <FloatingCTA />
            <FloatingWhatsApp />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
