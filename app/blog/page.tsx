"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendar, faUser, faTag } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import blogData from "@/config/blog-posts.json";

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}

type DiscordItem = {
  id: string;
  title?: string;
  summary?: string;
  content?: string;
  date: string;
  author: string;
  image?: string | null;
  attachments?: Array<{ url: string; content_type?: string | null }>;
  tags?: string[];
};

// ---------- settings ----------
const SHOW_TAG_FILTERS = true;
const ALLOWED_TAGS = new Set([
  "update",
  "event",
  "pvp",
  "arena",
  "tournament",
  "contest",
  "builds",
  "community",
  "performance",
  "optimization",
  "technical",
  "guide",
  "announcement",
  "rewards",
  "jobs",
]);

const KEYWORD_COVERS: Record<string, string> = {
  update: "/covers/update.jpg",
  event: "/covers/event.jpg",
  pvp: "/covers/pvp.jpg",
  arena: "/covers/pvp.jpg",
  tournament: "/covers/event.jpg",
  builds: "/covers/builds.jpg",
  community: "/covers/community.jpg",
  performance: "/covers/perf.jpg",
  optimization: "/covers/perf.jpg",
  technical: "/covers/technical.jpg",
  guide: "/covers/guide.jpg",
  jobs: "/covers/jobs.jpg",
  auction: "/covers/auction.jpg",
  crossplay: "/covers/crossplay.jpg",
  land: "/covers/land.jpg",
};

// ---------- helpers ----------
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const safeImage = (url?: string | null) =>
  !url
    ? "/placeholder.svg"
    : url.startsWith("/") || url.startsWith("http")
    ? url
    : "/placeholder.svg";

const extractTags = (txt: string) =>
  Array.from(txt.matchAll(/\[([^\]]+)\]/g))
    .map((m) => (m[1] ?? "").trim().toLowerCase())
    .filter(Boolean);

const stripTags = (txt: string) => txt.replace(/\[[^\]]+\]\s*/g, "").trim();

const findInlineCover = (text: string) =>
  text.match(/\[img:(https?:\/\/[^\]\s]+)\]/i)?.[1] ??
  text.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i)?.[1] ??
  null;

const pickFirstAttachmentImage = (a?: DiscordItem["attachments"]) =>
  !a?.length
    ? null
    : (a.find((x) => (x.content_type || "").startsWith("image/")) || a[0])?.url || null;

const pickTitleAndBody = (raw: string) => {
  const parts = stripTags(raw)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    title: parts[0] || "Announcement",
    body: parts.slice(1).join(" ").trim(),
  };
};

const sanitizeTags = (tags: string[]) =>
  Array.from(
    new Set(
      tags.filter(
        (t) =>
          t &&
          !/\w+\.\w+/.test(t) &&
          (ALLOWED_TAGS.size ? ALLOWED_TAGS.has(t) : true),
      ),
    ),
  );

const pickAutoCover = (title: string, content: string, tags: string[]) => {
  const hay = `${title} ${content}`.toLowerCase();
  for (const t of tags) if (KEYWORD_COVERS[t]) return KEYWORD_COVERS[t];
  for (const kw of Object.keys(KEYWORD_COVERS))
    if (hay.includes(kw)) return KEYWORD_COVERS[kw];
  return null;
};

const transformDiscordToPosts = (items: DiscordItem[]): BlogPost[] =>
  items.map((m) => {
    const base = (m.content ?? `${m.title ?? ""}\n${m.summary ?? ""}`).trim();
    const { title, body } = pickTitleAndBody(base);
    const inline = findInlineCover(base);
    const imgFromAttachments = pickFirstAttachmentImage(m.attachments);
    const primary = inline || m.image || imgFromAttachments || null;
    const tags = sanitizeTags(
      m.tags && m.tags.length ? m.tags : extractTags(base),
    );
    const auto = !primary ? pickAutoCover(title, base, tags) : null;

    return {
      id: m.id,
      title,
      slug: slugify(title),
      excerpt: (m.summary || body || base).slice(0, 220),
      content: base,
      image: safeImage(primary || auto || undefined),
      date: m.date,
      author: m.author,
      tags,
    };
  });

const localFallback = (): BlogPost[] =>
  (blogData?.posts || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug || slugify(p.title),
    excerpt: p.excerpt,
    content: p.content || `${p.title}\n${p.excerpt}`,
    image: safeImage(p.image),
    date: p.date,
    author: p.author || "Staff",
    tags: sanitizeTags(p.tags || []),
  }));

// ---------- component ----------
export default function ClientBlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"discord" | "local">("local");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Start with EMPTY posts (no flicker), then decide
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/discord/announcements", {
          cache: "no-store",
          // @ts-ignore
          next: { revalidate: 0 },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || (data as any)?.ok === false) {
          if (!cancelled) {
            setErrorMsg((data as any)?.reason || `discord_api_${res.status}`);
            setPosts(localFallback());
            setSource("local");
          }
          return;
        }
        const items = transformDiscordToPosts(
          Array.isArray((data as any).items) ? (data as any).items : [],
        );
        if (!cancelled) {
          if (items.length) {
            setPosts(items);
            setSource("discord");
          } else {
            setPosts(localFallback());
            setSource("local");
          }
        }
      } catch {
        if (!cancelled) {
          setErrorMsg("fetch_exception");
          setPosts(localFallback());
          setSource("local");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [posts],
  );

  const allTags = useMemo(() => {
    const t = Array.from(
      new Set(sortedPosts.flatMap((post) => post.tags)),
    ).filter(Boolean);
    return t.filter((x) =>
      ALLOWED_TAGS.size ? ALLOWED_TAGS.has(x) : true,
    );
  }, [sortedPosts]);

  const filteredPosts = useMemo(
    () =>
      sortedPosts.filter(
        (post) =>
          selectedTags.length === 0 ||
          selectedTags.every((t) => post.tags.includes(t)),
      ),
    [sortedPosts, selectedTags],
  );

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    if (typeof document !== "undefined")
      document.body.style.overflow = "hidden";
  };
  const closePost = () => {
    setSelectedPost(null);
    if (typeof document !== "undefined")
      document.body.style.overflow = "unset";
  };
  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 3
        ? [...prev, tag]
        : prev,
    );
  const clearAllTags = () => setSelectedTags([]);

  return (
    <div className="min-h-screen bg-brand-hero py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 pt-10 sm:pt-14 md:pt-16 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gradient leading-tight pb-1 mb-4">
            Server Blog
          </h1>

          {/* small NEW BUILD badge separate from heading so text doesn't clip */}
          <div className="flex justify-center mb-2">
            <span className="px-3 py-1 rounded-full bg-[rgba(0,0,0,0.45)] text-[0.7rem] uppercase tracking-[0.25em] text-[var(--brand-yellow)]">
              New Build
            </span>
          </div>

          <p
            className={`text-xs mb-2 ${
              source === "discord"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {source === "discord"
              ? "Live from Discord"
              : `Showing local posts${
                  errorMsg ? ` (Discord: ${errorMsg})` : ""
                }`}
          </p>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stay updated with the latest server news, updates, events, and
            community highlights.
          </p>

          {SHOW_TAG_FILTERS && allTags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    variant="outline"
                    size="sm"
                    disabled={
                      !selectedTags.includes(tag) &&
                      selectedTags.length >= 3
                    }
                    className={
                      selectedTags.includes(tag)
                        ? "btn-primary text-black"
                        : "border-[rgba(255,138,0,0.3)] text-[var(--brand-yellow)] hover:bg-[rgba(255,138,0,0.1)]"
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                  <span className="text-sm text-gray-400">
                    Selected tags ({selectedTags.length}/3):
                  </span>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[rgba(255,138,0,0.25)] text-[var(--brand-yellow)] text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-white transition-colors"
                      >
                        <FontAwesomeIcon
                          icon={faTimes as any}
                          className="w-3 h-3"
                        />
                      </button>
                    </span>
                  ))}
                  <Button
                    onClick={clearAllTags}
                    variant="ghost"
                    size="sm"
                    className="text-[var(--brand-orange)] hover:text-[var(--brand-yellow)] hover:bg-[rgba(255,138,0,0.1)] text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loader / skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse card-brand overflow-hidden"
              >
                <div className="h-48 bg-white/10" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="card-brand overflow-hidden hover:scale-105 hover:shadow-[0_0_25px_rgba(255,138,0,0.3)] transition-all duration-300 cursor-pointer group"
                  onClick={() => openPost(post)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gradient mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon
                          icon={faCalendar as any}
                          className="w-4 h-4 text-[var(--brand-orange)]"
                        />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon
                          icon={faUser as any}
                          className="w-4 h-4 text-[var(--brand-yellow)]"
                        />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[rgba(255,138,0,0.15)] text-[var(--brand-yellow)] text-xs rounded-full border border-[rgba(255,138,0,0.3)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No blog posts available.
                </p>
              </div>
            )}
          </>
        )}

        {/* Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-brand border border-[rgba(255,138,0,0.25)] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
              <div className="sticky top-0 bg-[rgba(21,6,18,0.8)] border-b border-[rgba(255,138,0,0.2)] p-4 flex items-center justify-between backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gradient truncate pr-4">
                  {selectedPost.title}
                </h2>
                <Button
                  onClick={closePost}
                  variant="ghost"
                  size="sm"
                  className="text-[var(--brand-orange)] hover:text-[var(--brand-yellow)] hover:bg-[rgba(255,138,0,0.1)] flex-shrink-0"
                >
                  <FontAwesomeIcon
                    icon={faTimes as any}
                    className="w-5 h-5"
                  />
                </Button>
              </div>

              <div className="p-6">
                <div className="relative h-64 sm:h-80 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedPost.image || "/placeholder.svg"}
                    alt={selectedPost.title}
                    fill
                    sizes="(max-width: 1024px) 80vw, 800px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faCalendar as any}
                        className="w-4 h-4 text-[var(--brand-orange)]"
                      />
                      <span>{formatDate(selectedPost.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faUser as any}
                        className="w-4 h-4 text-[var(--brand-yellow)]"
                      />
                      <span>{selectedPost.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faTag as any}
                      className="w-4 h-4 text-[var(--brand-orange)]"
                    />
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[rgba(255,138,0,0.15)] text-[var(--brand-yellow)] text-xs rounded-full border border-[rgba(255,138,0,0.3)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  {(selectedPost.content || "")
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-300 leading-relaxed mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
