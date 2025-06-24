"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HamburgerMenu from "./HamburgerMenu";
import { Ham } from "lucide-react";

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
      <nav className="items-center hidden md:flex space-x-6 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300">
        <div className="relative group">
          <a
            href="https://www.ndw.nu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f15a22]"
          >
            NDW Website
          </a>
          <span className="nav-underline"></span>
        </div>
        <div className="relative group">
          <a
            href="https://www.ndw.nu/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="dark:hover:text-white hover:text-gray-900 transition-all duration-300"
          >
            Contact
          </a>
          <span className="nav-underline"></span>
        </div>
        {isClientAuthenticated ? (
          <>
            <div className="relative group">
              <Link
                href="/uploadpage"
                className="dark:hover:text-white hover:text-gray-900 transition-all duration-300"
              >
                Upload
              </Link>
              <span className="nav-underline"></span>
            </div>
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="dark:hover:text-white hover:text-gray-900 transition-all duration-300"
              >
                Logout
              </button>
              <span className="nav-underline"></span>
            </div>
          </>
        ) : (
          <div className="relative group">
            <Link
              href="/loginPage"
              className="dark:hover:text-white hover:text-gray-900 transition-all duration-300"
            >
              Login
            </Link>
            <span className="nav-underline"></span>
          </div>
        )}
        <HamburgerMenu />
      </nav>
    </div>
  );
}
