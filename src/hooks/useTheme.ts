import { useCallback, useEffect, useState } from 'react';

export type StudioTheme = 'light-blue' | 'light-slate' | 'dark-blue';

const STORAGE_KEY = 'studio-theme';
const DEFAULT_THEME: StudioTheme = 'light-blue';

/**
 * Hook to manage the studio theme.
 * Sets `data-theme` on `<html>` and persists to localStorage.
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<StudioTheme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as StudioTheme | null;
    return stored || DEFAULT_THEME;
  });

  // Apply theme to DOM on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: StudioTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return { theme, setTheme };
};
