import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof Colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme ?? 'light');

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  const colors = Colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 