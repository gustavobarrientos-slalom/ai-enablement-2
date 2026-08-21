import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'todo-app-theme';
const THEMES = ['light', 'dark', 'system'];

function systemPrefersDark() {
  if (typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isDarkTheme(theme) {
  return theme === 'dark' || (theme === 'system' && systemPrefersDark());
}

// Reads the persisted theme (or falls back to system preference) and keeps the
// <html> `dark` class, localStorage, and OS-level changes all in sync.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : 'system';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme(theme));
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => document.documentElement.classList.toggle('dark', systemPrefersDark());
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((current) => THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]);
  }, []);

  return { theme, setTheme, cycleTheme };
}
