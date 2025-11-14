"use client";

import { useState } from "react";
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
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import homepageConfig from "@/config/homepage.json";

// Map string keys from config -> actual FontAwesome icons
const iconMap: Record<string, IconDefinition> = {
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

// ---- Stats (bottom 3 cards) ----
type StatItem = { title: string; description: string; icon?: keyof typeof iconMap };

const defaultStats: StatItem[] = [
  { title: "1+", description: "Active Players", icon: "faUsers" },
  { title: "Online", description: "Status", icon: "faServer" },
  { title: "Minecraft 1.21.8", description: "Version", icon: "faCube" },
];

const statsFromConfig: StatItem[] =
  // @ts-ignore – JSON may or may not have stats
  (Array.isArray((homepageConfig as any).stats) ? (homepageConfig as any).stats : []) || [];

const statsToRender: StatItem[] =
  statsFromConfig.length > 0
    ? statsFromConfig.map((s: any) => ({
        title: String(s.title ?? ""),
        description: String(s.description ?? ""),
        icon: s.icon as keyof typeof iconMap | undefined,
      }))
    : defaultStats;

export default function HomePage() {
  const [buttonText, setButtonText] = useState(homepageConfig.hero.buttonText);
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(MC_ADDRESS);
      } else {
        // Fallback for older browsers
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

          {/* Stats (replaces old 4.9/5 Rating) */}
          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {statsToRender.map((stat, i) => {
                const icon = stat.icon ? iconMap[stat.icon] : undefined;
                return (
                  <div
                    key={i}
                    className="card-brand rounded-lg p-6 flex flex-col items-center text-center"
                  >
                    {icon && (
                      <div
                        className="text-3xl mb-3"
                        style={{ color: "var(--brand-yellow)" }}
                        aria-hidden
                      >
                        <FontAwesomeIcon icon={icon} />
                      </div>
                    )}
                    <div className="text-3xl font-bold text-white">{stat.title}</div>
                    <div className="mt-1 text-sm uppercase tracking-wide text-gray-300">
                      {stat.description}
                    </div>
                  </div>
                );
              })}
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
              const icon = iconMap[feature.icon] ?? faBolt; // safe fallback
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
