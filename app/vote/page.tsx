'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Voter {
  rank: number;
  name: string;
  votes: number;
  avatar: string;
}

export default function VotePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch top voters from API
  async function fetchVoters() {
    try {
      const res = await fetch('/api/top-voters', { cache: 'no-store' });
      const data = await res.json();
      setVoters(data.voters || []);
    } catch (err) {
      console.error('Failed to fetch voters:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVoters();
    const interval = setInterval(fetchVoters, 30000); // auto refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-[#fbbf24] text-center mb-4">
          VOTE FOR REWARDS
        </h1>
        <p className="text-center text-gray-300 mb-10">
          Support our server by voting daily and earn amazing rewards including vote keys,
          diamonds, emeralds, and more!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Vote Links --- */}
          <div className="col-span-2 space-y-4">
            {[
              { num: 1, name: 'Minecraft-Server.net', url: 'https://minecraft-server.net/details/Indus_Realms/', desc: 'Vote to receive 1x Vote Key + Support the server!' },
              { num: 2, name: 'MinecraftServers.org', url: 'https://minecraftservers.org/server/679689', desc: 'Earn rewards and help us climb the ranks!' },
              { num: 3, name: 'TopG.org', url: 'https://topg.org/minecraft-servers/server-676615', desc: 'Voting helps attract more players to Indus Realms!' },
              { num: 4, name: 'Minecraft-MP.com', url: 'https://minecraft-mp.com/server-s349864', desc: 'Support Indus Realms and earn your daily Vote Key!' },
              { num: 5, name: 'Minecraftlist.org', url: 'https://minecraftlist.org/server/33918', desc: 'Vote daily for epic perks and keys!' },
              { num: 6, name: 'Minecraft.buzz', url: 'https://minecraft.buzz/vote/17194', desc: 'Keep the fire burning — get your reward!' },
            ].map((site) => (
              <div
                key={site.num}
                className="flex items-center justify-between bg-[#1a100b] p-4 rounded-xl border border-[#2a1a12]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#fbbf24] text-black font-bold px-3 py-2 rounded-lg">
                    {site.num}
                  </div>
                  <div>
                    <h2 className="font-bold">{site.name}</h2>
                    <p className="text-sm text-gray-400">{site.desc}</p>
                  </div>
                </div>
                <Link
                  href={site.url}
                  target="_blank"
                  className="bg-[#fbbf24] text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Vote Here 🔗
                </Link>
              </div>
            ))}
          </div>

          {/* --- Sidebar --- */}
          <div className="space-y-6">
            {/* --- Top Voters --- */}
            <div className="bg-[#1a100b] p-4 rounded-xl border border-[#2a1a12]">
              <h2 className="text-[#fbbf24] font-bold text-lg mb-3">Last Month's Top Voters</h2>

              {loading && <p className="text-gray-400 text-sm">Loading top voters...</p>}
              {!loading && voters.length === 0 && (
                <p className="text-gray-400 text-sm">No votes yet — be the first!</p>
              )}

              {!loading && voters.length > 0 && (
                <div className="space-y-3">
                  {voters.map((v) => (
                    <div
                      key={v.name}
                      className="flex items-center justify-between bg-[#24140f] p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={v.avatar}
                          alt={v.name}
                          className="w-8 h-8 rounded-full border border-[#fbbf24]"
                        />
                        <div>
                          <p className="font-semibold text-[#fbbf24]">
                            #{v.rank} {v.name}
                          </p>
                          <p className="text-xs text-gray-400">{v.votes} votes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- Monthly Rewards --- */}
            <div className="bg-[#1a100b] p-4 rounded-xl border border-[#2a1a12]">
              <h2 className="text-[#fbbf24] font-bold text-lg mb-3">Monthly Rewards</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>🥇 1st Place: $25 Store Credit + Exclusive Cosmetics</li>
                <li>🥈 2nd Place: $15 Store Credit + Rare Items</li>
                <li>🥉 3rd Place: $10 Store Credit + Vote Crates</li>
                <li>🏅 Top 10: Special Recognition + Rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
