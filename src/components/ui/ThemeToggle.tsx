'use client';

// src/components/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react';

const storageKey = 'prefers-dark';

/**
 * Toggles light ↔ dark theme.
 * 1. Reads preference from localStorage or system setting.
 * 2. Adds/removes `dark` class on <html>.
 * 3. Persists choice in localStorage.
 */
export default function ThemeToggle() {
  // Initial value: localStorage → OS preference → light
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [dark, setDark] = useState<boolean>(getInitial);

useEffect(() => {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark'); // removes the class (and the empty attribute)
  }
  localStorage.setItem('prefers-dark', String(dark));
}, [dark]);

  return (
    <button
      type="button"
      title="Toggle dark mode"
      onClick={() => setDark(!dark)}
      className="btn-ghost text-xl"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}