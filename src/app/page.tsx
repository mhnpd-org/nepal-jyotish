"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (username === "admin" && password === "1234") {
      // simple client-side redirect for this scaffold
      router.push("/astro/home");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF910B] to-[#EA5753] p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-amber-800 mb-4 text-center">Vedanga Jyotish</h1>
        <p className="text-sm text-amber-700/80 text-center mb-6">Sign in to continue to the dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-amber-800">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-slate-800"
              placeholder="admin"
              aria-label="username"
            />
          </label>

          <label className="block">
            <span className="text-sm text-amber-800">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-slate-800"
              placeholder="••••"
              aria-label="password"
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-md"
          >
            Sign in
          </button>
        </form>

      </div>
    </div>
  );
}
