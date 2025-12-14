"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import staffConfig from "@/config/staff.json";

/* 🎨 Different gradient brightness per rank */
const roleStyles = (sectionTitle: string) => {
  const key = sectionTitle.toLowerCase();
  if (key.includes("owner"))
    return { header: "from-[#ffcc66] via-[#ffae2d] to-[#ff8800]" }; // bright gold
  if (key.includes("admin"))
    return {
      // 💚 green gradient for admins
      header: "from-[#6ee7b7] via-[#22c55e] to-[#15803d]",
    };
  if (key.includes("mod"))
    return { header: "from-[#cdb4ff] via-[#a78bfa] to-[#8b5cf6]" }; // soft purple
  if (key.includes("helper"))
    return { header: "from-[#7dd3fc] via-[#38bdf8] to-[#0ea5e9]" }; // cyan tone
  return { header: "from-[#ffae2d] to-[#ff6a00]" };
};

export default function StaffPage() {
  const StaffSection = ({
    title,
    members,
    icon,
  }: {
    title: string;
    members: any[];
    icon: string;
  }) => {
    const colors = roleStyles(title);
    const isSmallRow = members.length <= 2;

    return (
      <section className="mb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 flex items-center justify-center text-[var(--ir-amber)]">
          <span className="mr-3 text-2xl">{icon}</span>
          {title}
        </h2>

        {/* Owners = grid, Admin + Mods (<=2) = centered row */}
        <div
          className={
            isSmallRow
              ? "flex flex-wrap justify-center gap-8"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          }
        >
          {members.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden p-0 w-full max-w-md flex flex-col bg-[#05070f]/95 border border-white/5 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.6)]"
            >
              {/* Top Discord-style bar */}
              <div className="bg-[#5865F2] px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faDiscord} className="text-lg" />
                  <span className="text-sm font-semibold tracking-wide">
                    Indus Realms
                  </span>
                </div>
                <span className="text-[10px] px-2 py-2 rounded-full bg-white/15 uppercase tracking-[0.12em]">
                  {title}
                </span>
              </div>

              {/* Banner + avatar */}
              <div className={`relative h-32 bg-gradient-to-r ${colors.header}`}>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ffffff40,_transparent_55%)]" />

                <div className="absolute -bottom-10 left-6 flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      width={90}
                      height={80}
                      className="rounded-full ring-4 ring-[#05070f] outline outline-2 outline-white/60 object-cover"
                    />
                    {/* online dot */}
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#05070f]" />
                  </div>
                  <div className="text-left drop-shadow-sm">
                    <h3 className="text-2xl sm:text-[30px] font-extrabold text-white leading-tight">
                      {member.name}
                    </h3>
                    <p className="mt-4 text-xs sm:text-sm font-medium text-white/80 [text-shadow:0_0_12px_rgba(0,0,0,0.8)]">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 px-6 pb-6 text-left text-[var(--ir-dim)]">
                <p className="text-sm sm:text-[15px] leading-relaxed italic mb-5 text-white/85">
                  “{member.description}”
                </p>

                <div className="h-px bg-white/10 mb-4" />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    Staff Profile
                  </span>

                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                    onClick={() =>
                      window.open(
                        member.discord || staffConfig.joinTeam.discordUrl,
                        "_blank"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faDiscord} className="text-sm" />
                    View on Discord
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[var(--ir-text)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-[var(--ir-amber)] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            {staffConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--ir-dim)] max-w-3xl mx-auto">
            {staffConfig.description}
          </p>
        </div>

        {/* Sections */}
        {staffConfig.sections.map((section: any, i: number) => (
          <StaffSection
            key={i}
            title={section.title}
            members={section.members}
            icon={section.icon}
          />
        ))}

        {/* Join team */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="ir-card p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--ir-amber)]">
              {staffConfig.joinTeam.title}
            </h3>
            <p className="text-base sm:text-lg text-[var(--ir-dim)] mb-6">
              {staffConfig.joinTeam.description}
            </p>
            <Button
              className="ir-btn px-6 sm:px-8 py-3 font-semibold transition-transform hover:scale-[1.03] active:scale-100"
              onClick={() =>
                window.open(staffConfig.joinTeam.discordUrl, "_blank")
              }
            >
              <FontAwesomeIcon icon={faDiscord} className="mr-2" />
              {staffConfig.joinTeam.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
