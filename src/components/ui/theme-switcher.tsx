"use client";

import * as React from 'react';

const PRESETS: Record<string, Record<string, string>> = {
  aq: {
    '--background': '216 50% 96%',
    '--foreground': '230 18% 20%',
    '--primary': '280 80% 55%',
    '--card': '0 0% 100%',
  },
  vibrant: {
    '--background': '265 40% 10%',
    '--foreground': '0 0% 98%',
    '--primary': '200 80% 55%',
    '--card': '232 47% 12%',
  },
  minimal: {
    '--background': '220 10% 98%',
    '--foreground': '210 8% 20%',
    '--primary': '210 16% 36%',
    '--card': '0 0% 100%',
  },
};

export default function ThemeSwitcher() {
  const [preset, setPreset] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('theme-preset');
    if (saved) setPreset(saved);
  }, []);

  React.useEffect(() => {
    if (!preset) return;
    const values = PRESETS[preset];
    Object.entries(values).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
    localStorage.setItem('theme-preset', preset);
  }, [preset]);

  return (
    <div className="flex items-center gap-2 px-2">
      <label className="text-xs text-muted-foreground mr-2">Tampilan:</label>
      <div className="flex gap-2">
        <button onClick={() => setPreset('aq')} className={`px-2 py-1 rounded-md text-xs ${preset === 'aq' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}>
          AQ
        </button>
        <button onClick={() => setPreset('vibrant')} className={`px-2 py-1 rounded-md text-xs ${preset === 'vibrant' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}>
          Vibrant
        </button>
        <button onClick={() => setPreset('minimal')} className={`px-2 py-1 rounded-md text-xs ${preset === 'minimal' ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}>
          Minimal
        </button>
      </div>
    </div>
  );
}
