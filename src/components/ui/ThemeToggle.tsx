// src/components/ui/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * Simple light ↔ dark toggle.
 * Adds / removes the `dark` class on <html>.
 * Tailwind is configured with `darkMode: 'class'`,
 * so any `dark:` utilities automatically switch.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Apply or remove the dark class whenever the toggle changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      type="button"
      title="Toggle dark mode"
      onClick={() => setDark(!dark)}
      className="btn-ghost text-xs"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}