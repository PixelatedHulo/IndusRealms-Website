'use client';

import { useEffect, useState } from 'react';

export default function PlayerCount() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const server = process.env.NEXT_PUBLIC_MC_SERVER || 'mc.indusrealms.com:2016';

  async function load() {
    try {
      const res = await fetch(`https://api.mcsrvstat.us/2/${server}`);
      const data = await res.json();
      if (data?.online && data.players?.online !== undefined) {
        setCount(data.players.online);
      } else {
        setCount(0);
      }
    } catch {
      setError(true);
      setCount(0);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (count === null) return <span>Loading...</span>;
  if (error) return <span>0</span>;
  return <span>{count}+</span>;
}
