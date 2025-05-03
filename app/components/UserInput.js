import { useState } from "react";

export default function UserInput({ setMessages }) {
    const [messageInput, setMessageInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = messageInput.trim();
        if (!userMessage) return;
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setMessageInput(""); 
        try {
            const res = await fetch("/api/chat",
                {
                    method: "POST",
                    body: JSON.stringify({ message: messageInput }),
                });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
        }
        catch (error) {
            setMessages((prev) => [...prev, { role: "bot", content: "Something went wrong!" }]);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }
    return (<div className="fixed bottom-6 w-full flex justify-center px-4">
        <form onSubmit={handleSubmit} className="relative border border-gray-600 rounded-lg px-4 py-2 w-full max-w-[700px] bg-[#111]">
            <textarea
                type="text"
                placeholder="Ask away!"
                value={messageInput}
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessageInput(e.target.value)}
                rows={1}
                className="w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none pr-16 text-base" />
            <button
                type="submit"
                className="absolute bottom-1 right-1 bg-blue-500 text-white px-3 py-1 text-sm
                               rounded-bl-none rounded-lg shadow-sm hover:bg-blue-600"
            >
                Send
            </button>
        </form>
    </div>
    );
};
