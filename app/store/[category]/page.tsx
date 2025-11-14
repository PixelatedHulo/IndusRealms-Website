"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faStar,
  faCrown,
  faGem,
  faBox,
  faMagic,
  faTools,
  faFistRaised,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import storeConfig from "@/config/store.json";

const iconMap = {
  faStar,
  faCrown,
  faGem,
  faBox,
  faMagic,
  faTools,
  faFistRaised,
};

export default function StoreCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Simple direct access – yahi pehle kaam kar raha tha
  const category = params.category;
  const typedCategory = category as keyof typeof storeConfig.categories;

  const categoryData = storeConfig.categories[typedCategory];
  const items = categoryData?.items || [];

  if (!categoryData) return <div>Category not found</div>;

  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[var(--ir-text)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-[var(--ir-amber)] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            {categoryData.title}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--ir-dim)] max-w-3xl mx-auto mb-8">
            {storeConfig.description.replace("{category}", category)}
          </p>

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {Object.keys(storeConfig.categories).map((cat) => {
              const active = cat === category;
              return (
                <Link key={cat} href={`/store/${cat}`}>
                  <Button
                    size="sm"
                    className={
                      active
                        ? "bg-gradient-to-b from-[#ffae2d] to-[#ff6a00] text-[#1a0f0b] font-bold shadow-[0_0_18px_rgba(255,180,60,.25)]"
                        : "bg-[rgba(26,16,11,.45)] border border-[rgba(255,174,45,.25)] text-[var(--ir-dim)] hover:bg-[rgba(26,16,11,.6)]"
                    }
                    variant={active ? "default" : "outline"}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Items Display */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center w-full">
            {items.map((item: any, index: number) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              const isKing = String(item.name || "").toUpperCase() === "KING";

              return (
                <div
                  key={index}
                  className="relative w-full max-w-md ir-tilt-hover group pt-10"
                >
                  {/* Floating icon */}
                  <div className="absolute -top-1 inset-x-0 flex justify-center z-20 pointer-events-none">
                    <div className="relative ir-float-soft group-hover:scale-105 transition-transform duration-300">
                      <div className="relative flex items-center justify-center rounded-[32px] px-8 py-5 bg-[rgba(6,4,2,0.98)] border border-[rgba(255,210,110,0.9)] shadow-[0_24px_52px_rgba(0,0,0,0.95)]">
                        {IconComponent ? (
                          <FontAwesomeIcon
                            icon={IconComponent as any}
                            className={`w-12 h-12 sm:w-14 sm:h-14 ${
                              isKing ? "text-[#ffd84a]" : "text-[var(--ir-amber)]"
                            } drop-shadow-[0_0_16px_rgba(255,220,120,0.55)]`}
                          />
                        ) : (
                          <span className="text-2xl font-bold text-[var(--ir-amber)]">
                            {item.name?.[0] || "R"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <Card className="mt-10 rounded-[26px] bg-[rgba(9,5,4,0.96)] border border-[rgba(255,174,45,0.18)] shadow-[0_26px_55px_rgba(0,0,0,0.85)] overflow-hidden relative">
                    <div className="px-8 pb-8 pt-10 flex flex-col gap-7">
                      {/* Name + badge */}
                      <div className="flex flex-col items-center gap-3 text-center">
                        {item.badge && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(0,0,0,0.55)] backdrop-blur-sm px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[#ffdb87] shadow-[0_0_12px_rgba(255,200,120,0.25)]">
                            <span>{item.badgeEmoji}</span>
                            <span>{item.badge}</span>
                          </span>
                        )}

                        <h3 className="text-[1.9rem] sm:text-[2.2rem] font-extrabold bg-gradient-to-b from-[#fff5d1] to-[#ffbf45] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,220,140,0.35)]">
                          {item.name}
                        </h3>

                        {item.tagline && (
                          <p className="text-xs sm:text-[0.85rem] text-[var(--ir-dim)] max-w-xs">
                            {item.tagline}
                          </p>
                        )}
                      </div>

                      {/* PRICE + BUTTONS */}
                      <div className="mt-1 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[0.75rem] font-medium tracking-[0.18em] text-[#cfae72] opacity-80">
                            STARTING AT
                          </span>
                        </div>

                        <div className="flex items-end justify-between -mt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-3xl font-extrabold text-[#ffc04a]">
                              {String(item.price).split(" / ")[0]}
                            </span>
                            <span className="text-xs sm:text-sm text-[var(--ir-dim)]">
                              / {String(item.price).split(" / ")[1] || "month"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          {/* Purchase button – pure anchor */}
                          <Button
                            asChild
                            className="ir-btn w-full justify-center text-sm sm:text-base font-semibold shadow-[0_0_12px_rgba(255,174,45,.28)]"
                          >
                            <a
                              href="https://argonix.eu"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Purchase Now
                            </a>
                          </Button>

                          {/* View perks – coins ke liye hide */}
                          {category !== "coins" && (
                            <Button
                              variant="outline"
                              className="w-full border-[rgba(255,174,45,.45)] bg-[rgba(12,7,5,.95)] hover:bg-[rgba(26,16,11,.98)] text-[0.8rem] sm:text-[0.85rem] text-[var(--ir-dim)] flex items-center justify-center gap-2"
                              onClick={() => setSelectedItem(item)}
                            >
                              <span>View full perks &amp; kit</span>
                              <FontAwesomeIcon
                                icon={faChevronRight as any}
                                className="w-3 h-3"
                              />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment info */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="ir-card p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#ffc04a]">
              {storeConfig.paymentInfo.title}
            </h3>
            <p className="text-base sm:text-lg text-[var(--ir-dim)]">
              {storeConfig.paymentInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Modal for perks/kit – coins pe disable */}
      {selectedItem && category !== "coins" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-[#120b08] border border-[rgba(255,174,45,.35)] p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 text-[var(--ir-dim)] hover:text-[var(--ir-amber)] text-xl leading-none"
            >
              ×
            </button>

            <div className="flex items-center gap-3 mb-4">
              {iconMap[selectedItem.icon as keyof typeof iconMap] && (
                <FontAwesomeIcon
                  icon={
                    iconMap[selectedItem.icon as keyof typeof iconMap] as any
                  }
                  className="w-7 h-7 text-[var(--ir-amber)]"
                />
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ir-amber)]">
                {selectedItem.name}
              </h2>
            </div>

            <p className="text-[var(--ir-dim)] mb-4">
              {selectedItem.description}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[var(--ir-amber)] mb-2">
                  Perks
                </h4>
                <ul className="space-y-1 max-h-60 overflow-y-auto pr-2 text-sm">
                  {selectedItem.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-[2px] text-[var(--ir-amber)]">◆</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-[rgba(255,174,45,.15)]">
                <h4 className="font-semibold text-[var(--ir-amber)] mb-2">
                  Kit Preview
                </h4>
                <div className="bg-[rgba(26,16,11,.85)] rounded-xl p-3 flex items-center justify-center min-h-[160px]">
                  {selectedItem.kitImage ? (
                    <Image
                      src={selectedItem.kitImage}
                      alt={`${selectedItem.name} kit preview`}
                      width={500}
                      height={260}
                      className="rounded-lg border border-[rgba(255,174,45,.35)] object-contain"
                    />
                  ) : (
                    <div className="text-sm text-[var(--ir-dim)] italic">
                      Kit image coming soon…
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,174,45,.15)]">
                <span className="text-lg sm:text-xl font-bold text-[#ffc04a]">
                  {selectedItem.price}
                </span>
                <Button className="ir-btn" asChild>
                  <a
                    href="https://argonix.eu"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Purchase this rank
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
