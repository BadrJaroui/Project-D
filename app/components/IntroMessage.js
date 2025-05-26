"use client";
import { motion } from "framer-motion";

export default function IntroMessage() {
    return (
        <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{duration: 1}}
            className="text-2xl sm:text-3xl font-bold text-center mt-10 animate-gradient-wave-to-white">
            Welkom bij de NDW-assistent! Vraag mij alles over het Nederlandse Wegverkeer!
        </motion.h1>
    );
}



