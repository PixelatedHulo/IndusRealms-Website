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
    return { header: "from-[#ffb366] via-[#ff8a1c] to-[#ff6600]" }; // warm orange
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

    return (
      <section className="mb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 flex items-center justify-center text-[var(--ir-amber)]">
          <span className="mr-3 text-2xl">{icon}</span>
          {title}
        </h2>

        {/* Uniform 3-column layout */}
        <div className="flex flex-wrap justify-center gap-8">
          {members.map((member, index) => (
            <Card
              key={index}
              className="ir-card overflow-hidden p-0 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[rgba(255,180,60,0.2)] group w-[300px] sm:w-[320px] md:w-[340px] flex flex-col"
            >
              <div
                className={`bg-gradient-to-b ${colors.header} px-6 py-6 text-center transition-all duration-500 group-hover:brightness-110`}
              >
                <Image
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-4 ring-4 ring-[#1a0f0b] outline outline-2 outline-[#ffd27a] group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a0f0b]">
                  {member.name}
                </h3>
                <p className="text-[#1a0f0b]/85 text-sm sm:text-base">
                  {member.role}
                </p>
              </div>

              <div className="p-6 flex flex-col grow justify-between">
                <p className="text-sm sm:text-base text-[var(--ir-dim)] mb-6">
                  {member.description}
                </p>

                {/* Centered Discord Button */}
                <div className="mt-auto text-center">
                  <Button
                    className="bg-[#ffae2d] hover:bg-[#ff8a00] text-black font-semibold px-4 py-2 mt-4 transition-all duration-300 hover:scale-105 rounded-md"
                    onClick={() =>
                      window.open(`https://discord.com/users/${member.discord}`, "_blank")
                    }
                  >
                    <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                    Discord
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
