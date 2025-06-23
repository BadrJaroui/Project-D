"use client";
import Reach, { createContext, useContext, useRef } from "react";
import BreathingBackground from "./BreathingBackground";

const BreathingContext = createContext(null);

export const useBreathing = () => useContext(BreathingContext);

export const BreathingProvider = ({ children }) => {
  const backgroundRef = useRef();
  const setBackgroundPulse = (isGenerating) => {
    backgroundRef.current?.setGenerating(isGenerating);
  };
  return (
    <BreathingContext.Provider value={{ setBackgroundPulse }}>
      <BreathingBackground ref={backgroundRef}>
        {children}
      </BreathingBackground>
    </BreathingContext.Provider>
  );
};
