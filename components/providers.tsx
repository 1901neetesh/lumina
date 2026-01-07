"use client";

import { ThemeProvider } from "@/lib/theme";
import { PWAInstall } from "@/components/pwa-install";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PWAInstall />
      {children}
    </ThemeProvider>
  );
}