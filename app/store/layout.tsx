"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  // prevent flashing
  if (checking) return null;

  return <>{children}</>;
}
