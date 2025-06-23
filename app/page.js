"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UserInput from "./components/UserInput";
import ChatReply from "./components/ChatReply";
import TopBanner from "./components/TopBanner";
import IntroMessage from "./components/IntroMessage";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 flex items-start justify-center pt-64 z-50 pointer-events-none">
          <IntroMessage />
        </div>
      )}
      <div className="w-full h-screen flex flex-col">
        <TopBanner />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar flex px-4 py-4 pb-28 justify-center z-11 mb-20"
        >
          <div className="w-full max-w-[700px]">
            <ChatReply messages={messages} />
          </div>
        </div>
        <UserInput setMessages={setMessages} setShowIntro={setShowIntro} />
      </div>
    </>
  );
}
