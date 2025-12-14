"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");

  // 🔍 page open hote hi check karo user pehle se logged-in to nahi
  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        const username =
          (user.user_metadata?.username as string | undefined) ||
          user.email?.split("@")[0] ||
          "Player";

        setDisplayName(username);
        setAlreadyLoggedIn(true);
      } else {
        setAlreadyLoggedIn(false);
      }

      setCheckingSession(false);
    };

    check();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // ✅ success → seedha store ranks pe
        router.push("/store/ranks");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoStore = () => {
    router.push("/store/ranks");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAlreadyLoggedIn(false);
    setDisplayName("");
    router.push("/"); // home pe bhej do
  };

  // jab tak session check ho raha hai
  if (checkingSession) {
    return null; // chahe to yahan chhota loader bhi dikha sakte ho
  }

  // 🔁 agar user already logged in hai → login form ki jagah yeh card
  if (alreadyLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md card-brand rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8)] text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            You&apos;re already logged in
          </h1>
          <p className="text-sm text-gray-300 mb-4">
            Welcome back,&nbsp;
            <span className="text-[#ffcc66] font-semibold">
              {displayName}
            </span>
            !
          </p>

          <Button
            onClick={handleGoStore}
            className="w-full mb-3 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff9a1f] to-[#ff7a1a] text-[#1a0800] font-semibold shadow-[0_0_20px_rgba(255,159,53,0.7)] hover:shadow-[0_0_24px_rgba(255,174,77,0.9)] hover:scale-[1.01] transition-all"
          >
            Go to Store
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full rounded-full border-[#ffb84d]/60 bg-black/30 text-[#ffe6b5] hover:bg-black/50 hover:border-[#ffd887]"
          >
            Logout
          </Button>

          <p className="mt-5 text-xs text-gray-400">
            Want to browse other pages?{" "}
            <Link
              href="/"
              className="text-[#ffcc66] hover:underline font-semibold"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // 🧾 normal login form (user not logged in)
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md card-brand rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back!
        </h1>

        <p className="text-sm text-gray-300 mb-6">
          Login to access ranks, purchases & coins.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-500/70 px-3 py-2 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-[#0c0502]/80 border border-[#543016] text-gray-100"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-[#0c0502]/80 border border-[#543016] text-gray-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff9a1f] to-[#ff7a1a] text-[#1a0800] font-semibold shadow-[0_0_20px_rgba(255,159,53,0.7)] hover:shadow-[0_0_24px_rgba(255,174,77,0.9)] hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center">
          New here?{" "}
          <Link
            href="/register"
            className="text-[#ffcc66] hover:underline font-semibold"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
