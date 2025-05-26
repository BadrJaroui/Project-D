'use client'
import { motion } from "framer-motion";

export default function BreathingBackground({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated background layer */}
            <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{

                    scale: [1, 1.02, 1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[url('/minimalist-black-bg.jpg')] bg-cover bg-center z-0"
            />

            {/* Foreground content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}