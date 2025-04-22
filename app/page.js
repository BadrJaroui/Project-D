"use client"
import { useState } from "react";
import Image from "next/image";

export default function Home() {

  // Creating 2 useState variables:
  const [message, SetMessage] = useState("");
  const [reply, SetReply] = useState("");

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const res = await fetch("/api/chat",
      {
        method: "POST",
        body: JSON.stringify({message}),
      });
  
    const data = await res.json();
    SetReply(data.reply);
  };

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
      Ask our chatbot anything about NDW!
      </div>
      <form onSubmit={handleSubmit}>
      <input
      type="text"
      placeholder="Ask away!"
      value={message}
      onChange={(e) => SetMessage(e.target.value)}
      className="border border-gray-600 rounded-lg px-4 py-2 w-80focus:outline-none focus:ring-blue-500"></input>
      </form>
      {reply && (
        <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg w-80 text-sm">
          {reply}
        </div>
      )}
    </div>
  );
}
