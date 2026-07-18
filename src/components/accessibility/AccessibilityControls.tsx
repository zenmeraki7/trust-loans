"use client";
import { useEffect, useState } from "react";
type Settings = { largeText: boolean; reduceMotion: boolean; lowBandwidth: boolean };
const defaults: Settings = { largeText: false, reduceMotion: false, lowBandwidth: false };
export default function AccessibilityControls() {
  const [open, setOpen] = useState(false); const [settings, setSettings] = useState<Settings>(defaults);
  useEffect(() => {
    let cancelled = false;
    const initialize = () => {
      if (cancelled) return;
      try {
        const stored = JSON.parse(localStorage.getItem("trust-loans-accessibility") || "null") as Partial<Settings> | null;
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        setSettings({ ...defaults, ...stored, lowBandwidth: stored?.lowBandwidth ?? Boolean(connection?.saveData) });
      } catch { setSettings(defaults); }
    };
    const requestIdle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback;
    const idle = requestIdle ? requestIdle(initialize, { timeout: 1200 }) : window.setTimeout(initialize, 200);
    return () => { cancelled = true; window.clearTimeout(idle); };
  }, []);
  useEffect(() => { const root = document.documentElement; root.dataset.textScale = settings.largeText ? "large" : "normal"; root.dataset.reduceMotion = settings.reduceMotion ? "true" : "false"; root.dataset.lowBandwidth = settings.lowBandwidth ? "true" : "false"; localStorage.setItem("trust-loans-accessibility", JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => { void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined); };
    const requestIdle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback;
    const idle = requestIdle ? requestIdle(register, { timeout: 2500 }) : window.setTimeout(register, 1000);
    return () => { window.clearTimeout(idle); };
  }, []);
  const toggle = (key: keyof Settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  return <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">{open ? <section id="accessibility-settings" aria-label="Accessibility settings" className="mb-2 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-950">Accessibility settings</h2><p className="mt-1 text-xs leading-5 text-slate-600">Settings are saved on this device.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close accessibility settings" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-lg text-slate-600">×</button></div><div className="mt-3 grid gap-2">{([ ["largeText", "Larger text", "Increase reading size across the site"], ["reduceMotion", "Reduce motion", "Minimize animation and transitions"], ["lowBandwidth", "Low-bandwidth mode", "Reduce non-essential media and data use"] ] as const).map(([key, label, detail]) => <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3"><input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} className="mt-1 h-5 w-5 shrink-0" /><span><span className="block text-sm font-semibold text-slate-900">{label}</span><span className="block text-xs leading-5 text-slate-600">{detail}</span></span></label>)}</div><button type="button" onClick={() => setSettings(defaults)} className="mt-3 text-xs font-semibold text-blue-700 underline">Reset settings</button></section> : null}<button type="button" aria-expanded={open} aria-controls="accessibility-settings" onClick={() => setOpen((value) => !value)} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg hover:bg-slate-50"><span aria-hidden="true">◉</span><span className="ml-2">Accessibility</span></button></div>;
}
