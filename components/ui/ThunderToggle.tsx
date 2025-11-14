"use client";

import { useEffect, useState } from "react";

type Props = { storageKey?: string };

export default function ThunderToggle({ storageKey = "thunder:muted" }: Props) {
  // true = muted, false = unmuted
  const [muted, setMuted] = useState(true);

  // load initial state from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      // default: muted
      localStorage.setItem(storageKey, "1");
      setMuted(true);
    } else {
      setMuted(raw === "1");
    }
  }, [storageKey]);

  const onToggle = () => {
    const next = !muted;                 // flip state
    setMuted(next);
    localStorage.setItem(storageKey, next ? "1" : "0"); // "0" = ON / unmuted

    // tell ThunderBehindClouds about the change
    window.dispatchEvent(
      new CustomEvent("thunder:muted-change", { detail: { muted: next } })
    );
  };

  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Enable thunder sound" : "Mute thunder sound"}
      className="
        fixed bottom-4 right-4 z-[9999]
        rounded-full px-4 py-2 text-sm font-semibold
        bg-amber-400 text-black shadow-xl border border-white/20
        hover:scale-105 active:scale-95 transition
      "
    >
      {muted ? "🔇 Thunder Off" : "🔊 Thunder On"}
    </button>
  );
}
