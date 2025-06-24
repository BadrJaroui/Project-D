"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HamburgerMenu from "./HamburgerMenu";

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
    <div className="w-full bg-white dark:bg-[#111] text-black dark:text-white flex items-center justify-between px-6 py-3 border-b border-gray-700 shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-4">
        <Image src="/NDWLogo.svg" alt="NDW Logo" width={120} height={120} />
        <span className="text-lg font-semibold mt-[10px]">
          Nationaal Dataportaal Wegverkeer
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300">
          <a
            href="https://www.ndw.nu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f15a22] group relative"
          >
            NDW Website
            <span className="nav-underline"></span>
          </a>
          <Link
            href="/"
            rel="noopener noreferrer"
            className="hover:text-gray-950 dark:hover:text-white transition group relative"
          >
            Chat
            <span className="nav-underline"></span>
          </Link>
          <a
            href="https://www.ndw.nu/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-950 dark:hover:text-white transition group relative"
          >
            Contact
            <span className="nav-underline"></span>
          </a>
          {isClientAuthenticated ? (
            <>
              <Link
                href="/uploadpage"
                className="hover:text-gray-950 dark:hover:text-white transition group relative"
              >
                Upload
                <span className="nav-underline"></span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-950 dark:hover:text-white transition group relative"
              >
                Logout
                <span className="nav-underline"></span>
              </button>
            </>
          ) : (
            <Link
              href="/loginPage"
              className="hover:text-gray-950 dark:hover:text-white transition group relative"
            >
              Login
              <span className="nav-underline"></span>
            </Link>
          )}
        </nav>
        <HamburgerMenu />
      </div>
    </div>
  );
}
