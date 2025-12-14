"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faTwitter,
  faYoutube,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

const YEAR = new Date().getFullYear();
const SERVER_NAME = "Indus Realms";
const MC_ADDRESS = "mc.indusrealms.com";
const SERVER_IP_DISPLAY = "150.230.237.207:2016";

const SOCIALS = [
  { label: "Discord", href: "https://discord.gg/SDBxkDJV69", icon: faDiscord },
  { label: "Twitter", href: "https://x.com/Indus_Realms?t=rWBMaufVXItWZGMwgz_6Qw&s=09", icon: faTwitter },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCOvQjDntN27KRPVhKX4lcPA", icon: faYoutube },
  { label: "Instagram", href: "https://www.instagram.com/indusrealms?igsh=ZG4weXpkbHU3azRh", icon: faInstagram },
];

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyIp = async () => {
    try {
      if (typeof navigator !== "undefined" && "clipboard" in navigator && window.isSecureContext) {
        await navigator.clipboard.writeText(MC_ADDRESS);
      } else {
        const ta = document.createElement("textarea");
        ta.value = MC_ADDRESS;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Copy failed. Please copy manually: " + MC_ADDRESS);
    }
  };

  return (
    <footer className="relative mt-20">
      {/* Glow divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />
      <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* === TOP ROW === */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-xl font-bold text-white">
              {SERVER_NAME} <span className="text-gradient">Network</span>
            </h2>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <button
              onClick={copyIp}
              className="group inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-semibold tracking-wide text-yellow-200 hover:bg-yellow-500/20 hover:border-yellow-400/70 transition-colors"
            >
              <span className="uppercase opacity-80">Join:</span>
              <span className="font-bold text-white">{SERVER_IP_DISPLAY}</span>
              <FontAwesomeIcon
                icon={copied ? faCheck : faCopy}
                className="h-4 w-4 transition-transform group-active:scale-95"
              />
            </button>

            <div className="flex items-center justify-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 hover:ring-white/20 transition-all"
                  title={s.label}
                >
                  <FontAwesomeIcon icon={s.icon} className="h-4 w-4 text-gray-200" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8 w-full" />

        {/* === BOTTOM LEGAL AREA === */}
        <div className="text-sm text-gray-400 text-center space-y-2">
          <p>© {YEAR} {SERVER_NAME}. All rights reserved.</p>
          <p>Not affiliated with Mojang or Microsoft.</p>

          <p className="space-x-4">
            <Link href="/refund" className="underline hover:text-white">Refund Policy</Link>
            <Link href="/privacy" className="underline hover:text-white">Privacy</Link>
            <Link href="/terms" className="underline hover:text-white">Terms & Conditions</Link>
            <Link href="/shipping" className="underline hover:text-white">Shipping Policy</Link>
            <Link href="/contact" className="underline hover:text-white">Contact Us</Link>
          </p>

          <p>
            Built with <span className="text-amber-400 font-semibold">fire</span>,{" "}
            <span className="text-pink-300 font-semibold">heart</span> ❤️ and{" "}
            <span className="text-amber-300 font-semibold">coffee</span> ☕.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
