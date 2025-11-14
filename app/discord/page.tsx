"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faUsers, faComments, faShield, faGift } from "@fortawesome/free-solid-svg-icons";
import discordConfig from "@/config/discord.json";

const iconMap = {
  faUsers,
  faComments,
  faShield,
  faGift,
};

export default function DiscordPage() {
  // ✅ Pull your invite link from .env.local
  const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/SDBxkDJV69";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/10 to-black py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <FontAwesomeIcon icon={faDiscord} className="w-16 sm:w-20 h-16 sm:h-20 text-[var(--brand-yellow)] mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-6">{discordConfig.title}</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {discordConfig.description}
          </p>

          {/* Join Button (opens invite link in new tab) */}
          <a href={invite} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faDiscord} className="mr-2" />
              {discordConfig.joinButton.text}
            </Button>
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {discordConfig.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <Card
                key={index}
                className="bg-brand-surface p-6 sm:p-8 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--brand-orange)]/20 group"
              >
                {IconComponent && (
                  <FontAwesomeIcon
                    icon={IconComponent as any}
                    className="w-10 sm:w-12 h-10 sm:h-12 text-[var(--brand-yellow)] mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-4 group-hover:text-[var(--brand-orange)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Discord Info Sections */}
        <div className="bg-brand-surface border border-[var(--brand-orange)]/30 rounded-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-6 text-center">
            {discordConfig.discordFeatures.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discordConfig.discordFeatures.sections.map((section, index) => (
              <div key={index}>
                <h4 className="text-base sm:text-lg font-semibold text-[var(--brand-yellow)] mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
