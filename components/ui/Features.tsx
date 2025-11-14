"use client";

import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"; // 👉 type import
import config from "@/config/homepage.json";

// Allowed icon keys (jo JSON me aate hain):
type IconKey =
  | "faBolt"
  | "faUsers"
  | "faCalendar"
  | "faCrown"
  | "faHeadset"
  | "faShield";

// Stable map (undefined chance 0)
const ICON_MAP: Record<IconKey, IconDefinition> = {
  faBolt: Icons.faBolt,
  faUsers: Icons.faUsers,
  faCalendar: Icons.faCalendar,
  faCrown: Icons.faCrown,
  faHeadset: Icons.faHeadset,
  faShield: Icons.faShield,
};

export default function Features() {
  return (
    <section className="py-20 bg-brand-surface text-center">
      <h2 className="text-4xl font-bold mb-12 text-gradient">Our Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {config.features.map((feature, i) => {
          // JSON se aaya hua string ko IconKey treat karo:
          const key = feature.icon as IconKey;
          const icon = ICON_MAP[key] ?? Icons.faBolt; // safety fallback

          return (
            <Card key={i} className="card-brand p-6 hover:scale-105 transition-all duration-300 group">
              <div className="flex flex-col items-center space-y-4">
                <FontAwesomeIcon
                  icon={icon as any}
                  className="text-4xl text-[var(--brand-yellow)] group-hover:text-[var(--brand-orange)] transition-colors"
                />
                <h3 className="text-xl font-bold text-gradient">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
