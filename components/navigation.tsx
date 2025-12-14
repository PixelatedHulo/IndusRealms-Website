"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import navigationConfig from "@/config/navigation.json";
import { supabase } from "@/lib/supabaseClient";

/** Remove query/hash and trailing slash (except root) */
const clean = (p: string) => {
  if (!p) return "/";
  const noQ = p.split("#")[0].split("?")[0];
  if (noQ === "/") return "/";
  return noQ.replace(/\/+$/, "");
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Active if exact match OR current path starts with href + "/" (for nested routes) */
const isActivePath = (pathname: string, href: string) => {
  if (isExternal(href)) return false; // don't highlight external
  const p = clean(pathname);
  const h = clean(href);
  if (h === "/") return p === "/";
  return p === h || p.startsWith(h + "/");
};

export function Navigation() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // auth state
  const [authReady, setAuthReady] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  // Close menu & scroll top on route change
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 🔐 Supabase auth + profile (username + avatar)
  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUserName(null);
        setAvatarUrl(null);
        setAuthReady(true);
        return;
      }

      const u = session.user;

      const username =
        (u.user_metadata?.username as string | undefined) ||
        u.email?.split("@")[0] ||
        "Player";
      setUserName(username);

      // avatar_url from profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", u.id)
        .single();

      if (!error && profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      } else {
        // fallback default avatar
        setAvatarUrl("/images/mc-avatar.png");
      }

      setAuthReady(true);
    };

    loadUserData();

    // auth change → reload profile
    const { data } = supabase.auth.onAuthStateChange(() => {
      loadUserData();
    });

    // optional: profile page se custom event aayega to bhi reload
    const onProfileUpdated = () => {
      loadUserData();
    };
    window.addEventListener("profile-updated", onProfileUpdated);

    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("profile-updated", onProfileUpdated);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    setAvatarUrl(null);
    router.push("/");
  };

  const loginActive = isActivePath(pathname, "/login");
  const registerActive = isActivePath(pathname, "/register");

  const avatarSrc = avatarUrl || "/images/mc-avatar.png";

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-[#ffb84d]/25
        bg-gradient-to-r from-[#100600] via-[#200c04] to-[#100600]
        shadow-[0_6px_18px_rgba(255,153,0,0.22)]
        backdrop-blur-md
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* === Brand === */}
          <Link
            href={navigationConfig.brand.href}
            onClick={closeMenu}
            className="flex items-center gap-2 group"
            aria-label={navigationConfig.brand.name}
          >
            <img
              src="/Diwali.png"
              alt="Indus Realms logo"
              width={30}
              height={30}
              className="h-8 w-8 rounded-full object-cover shadow-[0_0_8px_rgba(255,174,45,0.25)]"
            />
            <span
              className="
                text-transparent bg-clip-text bg-gradient-to-r
                from-[#ffd24d] via-[#ffb84d] to-[#ff9900]
                text-xl sm:text-2xl font-extrabold tracking-wide
                drop-shadow-[0_1px_2px_rgba(255,153,0,0.25)]
              "
            >
              Indus&nbsp;Realms
            </span>
          </Link>

          {/* === Desktop Navigation === */}
          <div className="hidden md:block">
            <div className="ml-8 flex items-center gap-3 lg:gap-4">
              {navigationConfig.navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                const commonClasses =
                  "relative px-4 py-2 rounded-md text-[15px] font-semibold transition-all duration-300";

                if (isExternal(item.href)) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        commonClasses,
                        "text-gray-100 hover:text-[#ffcc66] hover:bg-[#2b1608]/60"
                      )}
                    >
                      {item.name}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      commonClasses,
                      "hover:scale-105",
                      active
                        ? "bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[inset_0_1px_4px_rgba(0,0,0,0.25),0_3px_10px_rgba(255,153,0,0.32)]"
                        : "text-gray-100 hover:text-[#ffcc66] hover:bg-[#2b1608]/60"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* === Desktop Auth / User Area === */}
              {authReady && (
                <div className="ml-3 flex items-center gap-2">
                  {userName ? (
                    <>
                      {/* logged-in chip with avatar – click → /account */}
                      <div
                        onClick={() => router.push("/account")}
                        className="
                          flex items-center px-3 py-1.5 rounded-full
                          bg-black/40 border border-[#ffb84d]/40
                          text-xs text-[#ffe6b5]
                          shadow-[0_0_10px_rgba(0,0,0,0.7)]
                          cursor-pointer hover:bg-black/60 transition-colors
                        "
                      >
                        <div className="relative h-7 w-7 mr-2">
                          <img
                            src={avatarSrc}
                            alt="Player avatar"
                            className="h-7 w-7 rounded-full border border-[#ffcc66]/80 object-cover"
                          />
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-[#1a0800]" />
                        </div>
                        <span className="font-semibold truncate max-w-[130px]">
                          {userName}
                        </span>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="
                          inline-flex items-center rounded-full
                          px-4 py-2.5 text-sm font-semibold
                          border border-[#ffb84d]/40
                          bg-black/40 text-[#ffe6b5]
                          shadow-[0_0_10px_rgba(0,0,0,0.7)]
                          hover:border-[#ffd887]
                          hover:bg-black/60
                          hover:shadow-[0_0_14px_rgba(255,184,77,0.55)]
                          transition-all duration-300
                        "
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <button
                          className={cn(
                            "inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 border",
                            loginActive
                              ? "border-transparent bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[0_0_16px_rgba(255,174,77,0.75)]"
                              : "border-[#ffb84d]/40 bg-black/40 text-[#ffe6b5] shadow-[0_0_10px_rgba(0,0,0,0.7)] hover:border-[#ffd887] hover:bg-black/60 hover:shadow-[0_0_14px_rgba(255,184,77,0.55)]"
                          )}
                        >
                          Login
                        </button>
                      </Link>

                      <Link href="/register">
                        <button
                          className={cn(
                            "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 border",
                            registerActive
                              ? "border-transparent bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[0_0_16px_rgba(255,174,77,0.75)]"
                              : "border-[#ffb84d]/40 bg-black/40 text-[#ffe6b5] shadow-[0_0_10px_rgba(0,0,0,0.7)] hover:border-[#ffd887] hover:bg-black/60 hover:shadow-[0_0_14px_rgba(255,184,77,0.55)]"
                          )}
                        >
                          Register
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* === Mobile Hamburger === */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-200 hover:text-[#ffcc66] transition-all duration-300"
            aria-label={
              isOpen
                ? navigationConfig.mobileMenu.closeLabel
                : navigationConfig.mobileMenu.openLabel
            }
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* === Mobile Overlay === */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#120700]/95 backdrop-blur-sm z-40">
          <div className="space-y-3 px-6 pt-6 pb-8">
            {navigationConfig.navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              if (isExternal(item.href)) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className={cn(
                      "block text-lg font-semibold px-5 py-3 rounded-md transition-all duration-300",
                      "text-gray-100 hover:text-[#ffcc66] hover:bg-[#2b1608]/70"
                    )}
                  >
                    {item.name}
                  </a>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block text-lg font-semibold px-5 py-3 rounded-md transition-all duration-300",
                    active
                      ? "bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[0_3px_10px_rgba(255,153,0,0.32)]"
                      : "text-gray-100 hover:text-[#ffcc66] hover:bg-[#2b1608]/70"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* === Mobile Auth / User === */}
            {authReady && (
              <div className="mt-4 border-t border-[#ffb84d]/30 pt-4 flex flex-col gap-3">
                {userName ? (
                  <>
                    <div
                      onClick={() => {
                        closeMenu();
                        router.push("/account");
                      }}
                      className="flex items-center gap-3 text-sm text-[#ffe6b5] mb-1 cursor-pointer hover:bg-black/40 rounded-2xl px-2 py-2 transition-colors"
                    >
                      <div className="relative h-9 w-9">
                        <img
                          src={avatarSrc}
                          alt="Player avatar"
                          className="h-9 w-9 rounded-full border border-[#ffcc66]/80 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-[#1a0800]" />
                      </div>
                      <div>
                        <div className="text-[0.8rem] text-gray-300">
                          Logged in as
                        </div>
                        <div className="font-semibold text-[#ffcc66]">
                          {userName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="w-full rounded-full border border-[#ffb84d]/60 bg-black/40 px-5 py-2.5 text-base font-semibold text-[#ffe6b5] shadow-[0_0_12px_rgba(0,0,0,0.75)] hover:border-[#ffd887] hover:bg-black/60 hover:shadow-[0_0_16px_rgba(255,184,77,0.6)] transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMenu}>
                      <button
                        className={cn(
                          "w-full rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-300",
                          loginActive
                            ? "bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[0_0_18px_rgba(255,174,77,0.85)]"
                            : "border border-[#ffb84d]/60 bg-black/40 text-[#ffe6b5] shadow-[0_0_12px_rgba(0,0,0,0.75)] hover:border-[#ffd887] hover:bg-black/60 hover:shadow-[0_0_16px_rgba(255,184,77,0.6)]"
                        )}
                      >
                        Login
                      </button>
                    </Link>

                    <Link href="/register" onClick={closeMenu}>
                      <button
                        className={cn(
                          "w-full rounded-full px-5 py-3 text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                          registerActive
                            ? "bg-gradient-to-r from-[#ffb84d] to-[#ff9900] text-[#1a0800] shadow-[0_0_18px_rgba(255,174,77,0.85)]"
                            : "border border-[#ffb84d]/60 bg-black/40 text-[#ffe6b5] shadow-[0_0_12px_rgba(0,0,0,0.75)] hover:border-[#ffd887] hover:bg-black/60 hover:shadow-[0_0_16px_rgba(255,184,77,0.6)]"
                        )}
                      >
                        <span>Register</span>
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
