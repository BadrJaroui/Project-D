"use client"
import { useState } from "react";
import Image from "next/image";
import UserInput from "./components/UserInput";
import ChatReply from "./components/ChatReply";

export default function Home() {
  const [reply, setReply] = useState("");

  return (

    <div className="items-center object-cover rounded-lg w-full h-64 flex flex-col mt-05">
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
      <ChatReply reply={reply}/>
      <UserInput setReply={setReply} />
    </div>
  );
}
