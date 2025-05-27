"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function IntroMessage() {
  const [done, setDone] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handle = () => setDone(true);
    node.addEventListener("animationend", handle);
    return () => node.removeEventListener("animationend", handle);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={
        "text-2xl sm:text-3xl font-bold text-center mt-10" +
        (done
          ? "text-black dark:text-white"
          : "animate-gradient-wave-to-white dark:animate-gradient-wave-to-black")
      }
    >
      Welkom bij de NDW-assistent! Vraag mij alles over het Nederlandse
      Wegverkeer!
    </motion.h1>
  );
}
