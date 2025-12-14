// app/api/server-status/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.NEXT_PUBLIC_MC_SERVER_HOST;
  const port = process.env.NEXT_PUBLIC_MC_SERVER_PORT || "25565";

  if (!host) {
    return NextResponse.json(
      { online: false, players: 0, max: 0, version: null },
      { status: 500 }
    );
  }

  try {
    // Same API jaisa tum screenshot me use kar rahe the
    const url = `https://api.mcsrvstat.us/2/${host}:${port}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Status API returned ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      online: data.online ?? false,
      players: data.players?.online ?? 0,
      max: data.players?.max ?? 0,
      version: data.version ?? null,
    });
  } catch (err) {
    console.error("Server status error:", err);
    return NextResponse.json(
      { online: false, players: 0, max: 0, version: null },
      { status: 500 }
    );
  }
}
