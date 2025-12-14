"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faBolt,
  faUsers,
  faCalendar,
  faCrown,
  faHeadset,
  faShield,
  faServer,
  faCube,
  faLock,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import homepageConfig from "@/config/homepage.json";

// Map string keys from config -> actual FontAwesome icons
const iconMap = {
  faBolt,
  faUsers,
  faCalendar,
  faCrown,
  faHeadset,
  faShield,
  faServer,
  faCube,
};

const MC_ADDRESS = "mc.indusrealms.com";
const SERVER_IP_DISPLAY = "150.230.237.207:2016";

// ---- Server status type ----
type StatusResponse = {
  online: boolean;
  players: number;
  max: number;
  version: string | null;
};

export default function HomePage() {
  const [buttonText, setButtonText] = useState(homepageConfig.hero.buttonText);
  const [isClicked, setIsClicked] = useState(false);

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // 🛰 Fetch server status from our API
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await fetch("/api/server-status", { cache: "no-store" });
        const json = (await res.json()) as StatusResponse;
        setStatus(json);
      } catch (err) {
        console.error("Failed to load server status:", err);
        setStatus({
          online: false,
          players: 0,
          max: 0,
          version: null,
        });
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatus();

    // optional auto-refresh
    const id = setInterval(loadStatus, 30000);
    return () => clearInterval(id);
  }, []);

  const handleButtonClick = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(MC_ADDRESS);
      } else {
        const ta = document.createElement("textarea");
        ta.value = MC_ADDRESS;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setButtonText("Copied");
      setIsClicked(true);
      setTimeout(() => {
        setButtonText(homepageConfig.hero.buttonText);
        setIsClicked(false);
      }, 2000);
    } catch {
      alert("Copy failed. Please copy manually: " + MC_ADDRESS);
    }
  };

  // Derived texts for cards
  const playersText = statusLoading
    ? "…"
    : status
    ? String(status.players)
    : "0";

  const statusText = statusLoading ? "Checking..." : status?.online ? "Online" : "Offline";

  const versionText = statusLoading
    ? "Loading..."
    : status?.version || "Unknown";

  return (
    <div className="min-h-screen page-fade-bottom">
      {/* HERO */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
                <div className="text-white">{homepageConfig.hero.title.line1}</div>
                <div className="text-gradient font-extrabold not-italic drop-shadow-[0_0_10px_rgba(255,138,0,0.4)]">
                  {homepageConfig.hero.title.line2}
                </div>
              </h1>

              <p className="text-base sm:text-lg text-gray-200/90 leading-relaxed">
                {homepageConfig.hero.description}
              </p>

              <Button
                size="lg"
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full hover:scale-105 transition-all"
                onClick={handleButtonClick}
                aria-label="Copy Minecraft server address to clipboard"
              >
                {isClicked && <FontAwesomeIcon icon={faCheck} className="mr-2" />}
                {buttonText}
              </Button>

              <p className="text-sm text-gray-300">
                Server IP:{" "}
                <span className="text-gradient font-semibold">{SERVER_IP_DISPLAY}</span>
              </p>
            </div>

            {/* Right */}
            <div className="relative flex justify-center lg:justify-end">
              <Image
                src="/images/hero-character-hq.png"
                alt="Indus Realms Character"
                width={400}
                height={480}
                priority
                sizes="(max-width: 1024px) 60vw, 400px"
                className="w-full max-w-sm sm:max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Stats (dynamic) */}
          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Players */}
              <div className="card-brand rounded-lg p-6 flex flex-col items-center text-center">
                <div
                  className="text-3xl mb-3"
                  style={{ color: "var(--brand-yellow)" }}
                  aria-hidden
                >
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="text-3xl font-bold text-white">{playersText}</div>
                <div className="mt-1 text-sm uppercase tracking-wide text-gray-300">
                  Currently Online
                </div>
              </div>

              {/* Status */}
              <div className="card-brand rounded-lg p-6 flex flex-col items-center text-center">
                <div
                  className="text-3xl mb-3"
                  style={{ color: "var(--brand-yellow)" }}
                  aria-hidden
                >
                  <FontAwesomeIcon icon={faServer} />
                </div>
                <div className="text-3xl font-bold text-white">{statusText}</div>
                <div className="mt-1 text-sm uppercase tracking-wide text-gray-300">
                  Status
                </div>
              </div>

              {/* Version */}
              <div className="card-brand rounded-lg p-6 flex flex-col items-center text-center">
                <div
                  className="text-3xl mb-3"
                  style={{ color: "var(--brand-yellow)" }}
                  aria-hidden
                >
                  <FontAwesomeIcon icon={faCube} />
                </div>
                <div className="text-3xl font-bold text-white">{versionText}</div>
                <div className="mt-1 text-sm uppercase tracking-wide text-gray-300">
                  Version
                </div>
              </div>
            </div>
          </div>

          {/* STORE CTA */}
          <div className="mt-10 sm:mt-14">
            <div className="relative max-w-5xl mx-auto">
              <div
                className="
                  ir-card
                  relative
                  flex flex-col md:flex-row items-center justify-between gap-6
                  px-6 sm:px-10 py-6 sm:py-7
                  rounded-[26px]
                  border border-[rgba(255,174,45,0.18)]
                  bg-[rgba(9,5,4,0.94)]
                  shadow-[0_24px_60px_rgba(0,0,0,0.9)]
                  overflow-hidden
                  backdrop-blur-[2px]
                "
              >
                {/* left side */}
                <div className="relative z-10 text-left max-w-xl">
                  <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.55)] text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#ffdfa0]">
                    <FontAwesomeIcon icon={faLock} className="text-xs" />
                    <span>Indus Realms Store</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Gear up before you join the realms.
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4">
                    Unlock exclusive ranks, coin packs and premium perks that support the
                    server and make every session feel special.
                  </p>

                  <div className="flex flex-wrap gap-2 text-[0.7rem] sm:text-[0.75rem]">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(0,0,0,0.7)] text-gray-200">
                      ⚡ Instant delivery
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(0,0,0,0.7)] text-gray-200">
                      ❤️ Support the server
                    </span>
                  </div>
                </div>

                {/* right side button */}
                <div className="relative z-10">
                  <Link href="/store/ranks">
                    <Button className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#ffb347] to-[#ff8400] text-[#1a0f0b] font-semibold text-sm sm:text-base shadow-[0_0_22px_rgba(255,180,60,0.65)] hover:scale-105 transition-transform flex items-center gap-2">
                      <FontAwesomeIcon icon={faBoxOpen} className="text-sm sm:text-base" />
                      <span>Check out our Store</span>
                    </Button>
                  </Link>
                </div>

                {/* subtle background glow */}
                <div className="pointer-events-none absolute -inset-px opacity-25 bg-[radial-gradient(circle_at_left,_rgba(255,200,120,0.18),_transparent_55%),radial-gradient(circle_at_right,_rgba(255,120,50,0.18),_transparent_55%)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 sm:py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Our <span className="text-gradient">Features</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {homepageConfig.features.map((feature: any, index: number) => {
              const icon = iconMap[feature.icon] ?? faBolt;
              return (
                <div
                  key={index}
                  className="card-brand rounded-lg p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div
                    className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: "var(--brand-yellow)" }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gradient">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
