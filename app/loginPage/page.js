"use client";

import { useState } from "react";
import TopBanner from "../components/TopBanner";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLogin, setShowLogin] = useState(true); // NEW

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setUsername("");
        setPassword("");
        router.push("/uploadpage");
      } else {
        const data = await response.json();
        setLoginError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />

      <div className="flex-1 flex items-center justify-center">
        {showLogin && (
          <div className="relative p-11 rounded-2xl bg-white dark:bg-black">
            {/* Close Button */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-2 right-3 text-black dark:text-white text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <div className="flex text-black dark:text-white font-semibold justify-left mb-2">
              Admin login
            </div>

            <form
              onSubmit={handleLogin}
              className="flex flex-col items-center space-y-4 p-4"
            >
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-[#949494] px-8 py-4 border rounded-xl"
              />

              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-[#949494] px-8 py-4 border rounded-xl"
              />

              <button
                type="submit"
                className="bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-xl"
              >
                Login
              </button>
            </form>

            {loginError && (
              <p className="p-2 text-black dark:text-white rounded-xl border border-black/50 dark:border-white/50 shadow-inner mt-1">
                <span>{loginError}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
