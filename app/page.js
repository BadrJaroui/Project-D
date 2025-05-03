"use client"
import { useState } from "react";
import Image from "next/image";
import UserInput from "./components/UserInput";
import ChatReply from "./components/ChatReply";

export default function Home() {
  const [messages, setMessages] = useState([]);

  return (

    <div className="items-center object-cover rounded-lg w-full min-h-screen flex flex-col mt-05">
      <Image
        className="mt-7"
        src="/ndw-minimalist.png"
        alt="NDW Logo"
        width={300}
        height={300}
      />
      <div className="mb-5">
        Ask our chatbot anything about NDW
      </div>
      <div className="w-full max-w-[900px] overflow-y-auto max-h-[300px] mb-2">
        <ChatReply messages={messages} /> {/*TODO: Van ChatReply naar Chat hernoemen, want user chats en replies wordt hier behandeld*/}
      </div>
      <UserInput setMessages={setMessages}/>
    </div>
  );
}
