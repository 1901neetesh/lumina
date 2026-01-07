"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'neon' | 'warm' | 'cool' | 'vibrant';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  secondaryColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  neon: { accent: '#00FF9C', secondary: '#FFD700' },
  warm: { accent: '#FF6B6B', secondary: '#FFA500' },
  cool: { accent: '#00BFFF', secondary: '#1E90FF' },
  vibrant: { accent: '#9C27B0', secondary: '#FF1493' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('neon');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('lumina_theme', newTheme);
    // Update CSS variables for dynamic theming (shadcn compatible)
    const root = document.documentElement;
    root.style.setProperty('--primary', themeColors[newTheme].accent);
    root.style.setProperty('--primary-foreground', '#ffffff');
    root.style.setProperty('--accent', themeColors[newTheme].secondary);
    root.style.setProperty('--accent-foreground', '#000000');
  };

  useEffect(() => {
    const saved = localStorage.getItem('lumina_theme');
    if (saved && ['neon', 'warm', 'cool', 'vibrant'].includes(saved)) {
      setTheme(saved as Theme);
    } else {
      setTheme('neon'); // Default
    }
  }, []);

  const value = {
    theme,
    setTheme,
    accentColor: themeColors[theme].accent,
    secondaryColor: themeColors[theme].secondary,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}