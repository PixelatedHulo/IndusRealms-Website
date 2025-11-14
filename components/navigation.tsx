"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import navigationConfig from "@/config/navigation.json";

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
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="ml-8 flex items-center gap-2 lg:gap-3">
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
            </div>
          </div>

          {/* === Mobile Hamburger === */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-200 hover:text-[#ffcc66] transition-all duration-300"
            aria-label={
              isOpen ? navigationConfig.mobileMenu.closeLabel : navigationConfig.mobileMenu.openLabel
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
          </div>
        </div>
      )}
    </nav>
  );
}
