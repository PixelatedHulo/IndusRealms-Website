"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faServer, faStar } from "@fortawesome/free-solid-svg-icons";

type ApiResp = {
  online?: boolean;
  players?: { online?: number; max?: number };
};

export function ServerStats() {
  const [stats, setStats] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);

  const server = process.env.NEXT_PUBLIC_MC_SERVER || "mc.indusrealms.com:2016";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.mcstatus.io/v2/status/java/${server}`, {
          cache: "no-store",
        });
        const data: ApiResp = await res.json();
        setStats({
          online: !!data.online,
          players: {
            online: data.players?.online ?? 0,
            max: data.players?.max ?? 0,
          },
        });
      } catch (e) {
        console.error("Failed to fetch server stats:", e);
        setStats({ online: false, players: { online: 0, max: 0 } });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, [server]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-orange-900/20 border-amber-600/30 p-6 animate-pulse">
              <div className="h-8 bg-amber-600/30 rounded mb-2" />
              <div className="h-4 bg-orange-800/20 rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isOnline = !!stats?.online;
  const playerCount = stats?.players?.online ?? 0;
  const showPlus = playerCount > 0;

  const statsData = [
    { icon: faUsers, value: showPlus ? `${playerCount}+` : `${playerCount}`, label: "Active Players" },
    { icon: faServer, value: isOnline ? "Online" : "Offline", label: "Status" },
    { icon: faStar, value: "4.9/5", label: "Rating" },
  ];

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-orange-900/20 border-amber-600/30 p-6 text-center
                       hover:bg-orange-900/30 transition-all duration-300
                       hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20
                       group backdrop-blur-sm"
          >
            <div className="flex flex-col items-center space-y-3">
              <FontAwesomeIcon
                icon={stat.icon}
                className="w-8 h-8 text-orange-400 group-hover:text-amber-300 group-hover:scale-110 transition-all duration-300"
              />
              <div className="text-3xl font-bold text-orange-400 group-hover:text-amber-300 transition-colors">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                {stat.label}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
