"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function IntroMessage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid rendering on the server

  const animationClass =
    resolvedTheme === "dark"
      ? "animate-gradient-wave-to-white"
      : "animate-gradient-wave-to-black";

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`text-2xl sm:text-3xl font-bold text-center mt-10 ${animationClass}`}
    >
      Welkom bij de NDW-assistent! Vraag mij alles over het Nederlandse
      Wegverkeer!
    </motion.h1>
  );
}
