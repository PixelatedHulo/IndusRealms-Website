"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: null,
    avatar_url: null,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 🔁 Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        // 🟢 username ALWAYS set (fallbacks)
        const username =
          data?.username ||
          (session.user.user_metadata as any)?.username ||
          session.user.email?.split("@")[0] ||
          "Player";

        setProfile({
          username,
          avatar_url: data?.avatar_url ?? null,
        });

        setPreviewUrl(data?.avatar_url ?? null);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // 🖼 File select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setMessage(null);
    setError(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 💾 Save profile – avatar update only
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setSaving(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.user) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // 🟢 username MUST NEVER BE NULL  
      const safeUsername =
        profile.username ||
        (session.user.user_metadata as any)?.username ||
        session.user.email?.split("@")[0] ||
        "Player";

      let avatarUrlToSave = profile.avatar_url ?? null;

      // Upload new avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop() || "png";
        const filePath = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        avatarUrlToSave = publicUrl;
      }

      // 🟢 FIX: username ALWAYS INCLUDED (not null)
      const updates = {
        id: userId,
        username: safeUsername,
        avatar_url: avatarUrlToSave,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (upsertError) throw upsertError;

      setProfile((prev) => ({
        ...prev,
        avatar_url: avatarUrlToSave,
      }));

      setMessage("Profile saved successfully!");
      setAvatarFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-[#ffe6b5]">
        Loading your profile...
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full rounded-[32px] bg-gradient-to-b from-black/70 via-[#1b0a02]/90 to-black/80 border border-[#ffb84d]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] px-8 py-10">
        <h1 className="text-3xl font-extrabold text-[#ffe6b5] mb-2">
          Your profile
        </h1>
        <p className="text-sm text-[#ffdca0]/80 mb-8">
          Update your avatar for Indus Realms.
        </p>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Username (READ ONLY) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#ffdca0]">
              Username
            </label>

            <div className="w-full rounded-2xl bg-black/60 border border-[#ffb84d]/40 px-4 py-2.5 text-sm text-[#ffe6b5]">
              {profile.username}
            </div>

            <p className="text-xs text-[#ffdda8]/70">
              Username cannot be changed.
            </p>
          </div>

          {/* Avatar upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#ffdca0]">
              Avatar
            </label>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full border border-[#ffcc66]/80 overflow-hidden bg-black/60 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-[#ffdda8]/60">No image</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9900] px-4 py-2 text-xs font-semibold text-[#1a0800] shadow-[0_8px_24px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  Choose image
                </label>
                <p className="text-[11px] text-[#ffdda8]/70">Upload a PNG/JPEG.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/60 bg-red-900/30 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-900/30 px-3 py-2 text-xs text-emerald-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff9a1f] to-[#ff7a1a] px-6 py-3 text-sm font-semibold text-[#1a0800] shadow-[0_16px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)] disabled:opacity-60 transition-all"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
