"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username || !email || !password) {
      setErrorMsg("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          "Account created! Check email to confirm your account."
        );
        setPassword("");
        setConfirm("");
      }
    } catch {
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md card-brand rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Join the realms!
        </h1>

        <p className="text-sm text-gray-300 mb-6">
          Create your Indus Realms account to track ranks & purchases.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-500/70 px-3 py-2 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg bg-green-900/40 border border-green-500/70 px-3 py-2 text-xs text-green-200">
            {successMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="text-sm text-gray-300">Minecraft Username</label>
            <input
              type="text"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-[#0c0502]/80 border border-[#543016] text-gray-100"
              placeholder="Your in-game name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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

          <div>
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-[#0c0502]/80 border border-[#543016] text-gray-100"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-gradient-to-r from-[#ffb347] to-[#ff7a1a] text-[#1a0800] font-semibold shadow-[0_0_20px_rgba(255,159,53,0.7)]"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ffcc66] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
