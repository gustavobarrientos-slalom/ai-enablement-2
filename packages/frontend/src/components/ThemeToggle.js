import React from 'react';

const THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

function ThemeToggle({ theme, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm text-primary-foreground">
        Theme
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`Theme, currently ${THEME_LABELS[theme]}`}
        className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}

export default ThemeToggle;
