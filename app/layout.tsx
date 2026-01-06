import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina | Premium Lifestyle Architect",
  description: "Curated exercise and fashion guidance for the modern aesthete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        oswald.variable,
        "bg-brand-black text-white antialiased overflow-hidden selection:bg-brand-volt selection:text-black"
      )}>
        {children}
      </body>
    </html>
  );
}
