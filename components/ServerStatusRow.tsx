"use client";

import { useEffect, useState } from "react";

type StatusResponse = {
  online: boolean;
  players: number;
  max: number;
  version: string | null;
};

export function ServerStatusRow() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/server-status", { cache: "no-store" });
        const json = (await res.json()) as StatusResponse;
        setStatus(json);
      } catch (e) {
        console.error(e);
        setStatus({
          online: false,
          players: 0,
          max: 0,
          version: null,
        });
      } finally {
        setLoading(false);
      }
    };

    load();

    // optional: har 30 sec me refresh
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const onlineText = status?.online ? "Online" : "Offline";
  const onlineColor = status?.online ? "#22c55e" : "#f97373";

  const playersText =
    status && !loading ? `${status.players}` : loading ? "…" : "0";

  const versionText =
    status && status.version
      ? status.version
      : loading
      ? "Loading..."
      : "Unknown";

  return (
    <section className="mt-8 grid gap-6 md:grid-cols-3">
      {/* Players */}
      <div className="rounded-3xl border border-[#ffb84d]/40 bg-black/30 px-8 py-6 flex flex-col items-center justify-center">
        <div className="mb-2 text-3xl">👥</div>
        <div className="text-3xl font-bold text-[#ffe6b5]">
          {playersText}
          {status?.players && status.players > 0 ? "" : ""}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#ffdda8]/70">
          Currently Online
        </div>
      </div>

      {/* Status */}
      <div className="rounded-3xl border border-[#ffb84d]/40 bg-black/30 px-8 py-6 flex flex-col items-center justify-center">
        <div className="mb-2 text-3xl">🖥️</div>
        <div
          className="text-2xl font-bold"
          style={{ color: loading ? "#ffe6b5" : onlineColor }}
        >
          {loading ? "Checking..." : onlineText}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#ffdda8]/70">
          Status
        </div>
      </div>

      {/* Version */}
      <div className="rounded-3xl border border-[#ffb84d]/40 bg-black/30 px-8 py-6 flex flex-col items-center justify-center">
        <div className="mb-2 text-3xl">🧱</div>
        <div className="text-2xl font-bold text-[#ffe6b5]">
          {versionText}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#ffdda8]/70">
          Version
        </div>
      </div>
    </section>
  );
}
