import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { FloatingCTA } from "@/components/layout/FloatingCTA";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} antialiased bg-[var(--color-background)]`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-fg)] flex flex-col">
        <MotionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <FloatingCTA />
        </MotionProvider>
      </body>
    </html>
  );
}
