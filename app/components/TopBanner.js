"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TopBanner() {
  const router = useRouter();
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/check-auth");
      if (response.ok) {
        setIsClientAuthenticated(true);
      } else {
        setIsClientAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to check authentication status:", error);
      setIsClientAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      if (response.ok) {
        setIsClientAuthenticated(false);
        router.push("/loginPage");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="w-full bg-[#111] text-white flex items-center justify-between px-6 py-3 border-b border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <Image src="/NDWLogo.svg" alt="NDW Logo" width={120} height={120} />
        <span className="text-lg font-semibold mt-[10px]">
          Nationaal Dataportaal Wegverkeer
        </span>
      </div>
      <nav className="hidden md:flex space-x-6 text-sm text-gray-300">
        <a
          href="https://www.ndw.nu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f15a22]"
        >
          NDW Website
        </a>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          Chat
        </Link>
        <a
          href="https://www.ndw.nu/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          Contact
        </a>
        {isClientAuthenticated ? (
          <>
            <Link href="/uploadpage" className="hover:text-white transition">
              Upload
            </Link>
            <button onClick={handleLogout} className="hover:text-white transition">
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/loginPage"
            className="hover:text-white transition"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
