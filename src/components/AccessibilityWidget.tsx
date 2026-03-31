"use client";

import { useState, useEffect, useCallback } from "react";

interface A11ySettings {
  fontSize: number; // 0 = normal, 1 = large, 2 = x-large
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  bigCursor: boolean;
  lineHeight: boolean;
  textSpacing: boolean;
  stopAnimations: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  bigCursor: false,
  lineHeight: false,
  textSpacing: false,
  stopAnimations: false,
};

const STORAGE_KEY = "artiz-a11y";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as A11ySettings;
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to document
  const applySettings = (s: A11ySettings) => {
    const html = document.documentElement;
    const cl = html.classList;

    // Font size
    cl.remove("a11y-font-1", "a11y-font-2");
    if (s.fontSize === 1) cl.add("a11y-font-1");
    if (s.fontSize === 2) cl.add("a11y-font-2");

    // High contrast
    cl.toggle("a11y-high-contrast", s.highContrast);

    // Grayscale
    cl.toggle("a11y-grayscale", s.grayscale);

    // Highlight links
    cl.toggle("a11y-highlight-links", s.highlightLinks);

    // Readable font
    cl.toggle("a11y-readable-font", s.readableFont);

    // Big cursor
    cl.toggle("a11y-big-cursor", s.bigCursor);

    // Line height
    cl.toggle("a11y-line-height", s.lineHeight);

    // Text spacing
    cl.toggle("a11y-text-spacing", s.textSpacing);

    // Stop animations
    cl.toggle("a11y-stop-animations", s.stopAnimations);
  };

  const update = (partial: Partial<A11ySettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    applySettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const reset = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    },
    [open]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-[100] w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center"
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <circle cx="12" cy="4.5" r="2" />
          <path d="M7 8.5h10M12 8.5v5m0 0l-3 5.5m3-5.5l3 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-[100]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        id="a11y-panel"
        role="dialog"
        aria-modal="true"
        aria-label="הגדרות נגישות"
        className={`fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto sm:w-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-[101] transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full sm:translate-y-[calc(100%+2rem)]"
        }`}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-primary">הגדרות נגישות</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-primary/5 rounded-lg transition-colors"
              aria-label="סגור תפריט נגישות"
            >
              <svg className="w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-primary mb-2">גודל טקסט</p>
            <div className="flex gap-2">
              {[
                { value: 0, label: "רגיל", size: "text-sm" },
                { value: 1, label: "גדול", size: "text-base" },
                { value: 2, label: "גדול מאוד", size: "text-lg" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ fontSize: opt.value })}
                  aria-pressed={settings.fontSize === opt.value}
                  className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${opt.size} ${
                    settings.fontSize === opt.value
                      ? "bg-primary text-white"
                      : "bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            <ToggleOption
              label="ניגודיות גבוהה"
              icon="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              active={settings.highContrast}
              onToggle={() => update({ highContrast: !settings.highContrast })}
            />
            <ToggleOption
              label="גווני אפור"
              icon="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
              active={settings.grayscale}
              onToggle={() => update({ grayscale: !settings.grayscale })}
            />
            <ToggleOption
              label="הדגשת קישורים"
              icon="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.244a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
              active={settings.highlightLinks}
              onToggle={() => update({ highlightLinks: !settings.highlightLinks })}
            />
            <ToggleOption
              label="פונט קריא"
              icon="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              active={settings.readableFont}
              onToggle={() => update({ readableFont: !settings.readableFont })}
            />
            <ToggleOption
              label="סמן גדול"
              icon="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
              active={settings.bigCursor}
              onToggle={() => update({ bigCursor: !settings.bigCursor })}
            />
            <ToggleOption
              label="ריווח שורות"
              icon="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              active={settings.lineHeight}
              onToggle={() => update({ lineHeight: !settings.lineHeight })}
            />
            <ToggleOption
              label="ריווח טקסט"
              icon="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              active={settings.textSpacing}
              onToggle={() => update({ textSpacing: !settings.textSpacing })}
            />
            <ToggleOption
              label="עצירת אנימציות"
              icon="M15.75 5.25v13.5m-7.5-13.5v13.5"
              active={settings.stopAnimations}
              onToggle={() => update({ stopAnimations: !settings.stopAnimations })}
            />
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full mt-6 py-3 border-2 border-primary/20 text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
          >
            איפוס הגדרות
          </button>

          {/* Link to accessibility page */}
          <a
            href="/accessibility"
            className="block text-center mt-3 text-sm text-primary/50 hover:text-primary transition-colors"
          >
            הצהרת נגישות
          </a>
        </div>
      </div>
    </>
  );
}

function ToggleOption({
  label,
  icon,
  active,
  onToggle,
}: {
  label: string;
  icon: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={active}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-primary/5 text-primary hover:bg-primary/10"
      }`}
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
      <span className="font-semibold text-sm flex-1 text-right">{label}</span>
      <div
        className={`w-10 h-6 rounded-full relative transition-colors ${
          active ? "bg-white/30" : "bg-primary/20"
        }`}
        aria-hidden="true"
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
            active ? "bg-white right-1" : "bg-primary/40 left-1"
          }`}
        />
      </div>
    </button>
  );
}
