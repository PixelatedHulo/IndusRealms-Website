// app/api/discord/announcements/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";           // Edge nahi, Node fetch want
export const dynamic = "force-dynamic";    // no cache
export const revalidate = 0;

type DiscordMessage = {
  id: string;
  content: string;
  timestamp: string;
  author: { username: string };
  attachments?: Array<{ url: string; content_type?: string | null }>;
  embeds?: Array<{ thumbnail?: { url?: string } }>;
};

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID;

  if (!token || !channelId) {
    return NextResponse.json(
      { ok: false, reason: "missing_env", missing: { DISCORD_BOT_TOKEN: !token, DISCORD_ANNOUNCEMENTS_CHANNEL_ID: !channelId } },
      { status: 200 }
    );
  }

  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${token}`,
      },
      cache: "no-store",
    });

    // Agar Discord se HTML/redirect aaye to bhi JSON se wrap karke bhej do
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const body = contentType.includes("application/json") ? await res.json() : await res.text();
      return NextResponse.json(
        { ok: false, reason: `discord_${res.status}`, body: typeof body === "string" ? body.slice(0, 400) : body },
        { status: 200 }
      );
    }

    let data: DiscordMessage[] = [];
    if (contentType.includes("application/json")) {
      data = (await res.json()) as DiscordMessage[];
    } else {
      // safety: kabhi HTML aa jaye
      const text = await res.text();
      return NextResponse.json({ ok: false, reason: "discord_non_json", body: text.slice(0, 400) }, { status: 200 });
    }

    // Transform → front-end friendly
    const items = data.map((m) => {
      const image =
        m.attachments?.[0]?.url ||
        m.embeds?.[0]?.thumbnail?.url ||
        null;

      // Tags like [update], [event] …
      const tags = Array.from(m.content.matchAll(/\[([^\]]+)\]/g)).map((x) => (x[1] || "").toLowerCase());

      return {
        id: m.id,
        title: undefined,                // client title parser banata hai
        summary: undefined,              // client hi banayega
        content: m.content,
        date: m.timestamp,
        author: m.author?.username || "Staff",
        image,
        attachments: m.attachments || [],
        tags,
      };
    });

    return NextResponse.json(
      { ok: true, items },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, reason: "fetch_exception", error: String(e?.message || e) },
      { status: 200 }
    );
  }
}
