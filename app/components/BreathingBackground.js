"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useTheme } from "next-themes";

const BreathingBackground = forwardRef(({ children }, ref) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const gradientRef = useRef(null);
  const circleRef = useRef(null);
  const breathingRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    breathingRef.current = gsap.to(circleRef.current, {
      scale: 1.1,
      transformOrigin: "50% 50%",
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setGenerating(isGenerating) {
      if (breathingRef.current) {
        breathingRef.current.duration(isGenerating ? 1 : 7);
      }
    },
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black transition-all duration-300">
      {mounted && resolvedTheme && (
        <svg
          className="absolute top-0 left-0 w-full h-full z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="sphereGradientv2" ref={gradientRef}>
              <stop
                offset="0%"
                stopColor={resolvedTheme === "dark" ? "#222222" : "#e0e0e0"}
              />
              <stop
                offset="100%"
                stopColor={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
              />
            </radialGradient>
          </defs>

          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="30"
            fill="url(#sphereGradientv2)"
          />
        </svg>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

export default BreathingBackground;
