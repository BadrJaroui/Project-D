import { useState } from "react";

export default function UserInput({ setMessages }) {
    const [messageInput, setMessageInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = messageInput.trim();
        if (!userMessage) return;
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setMessageInput("");

        const placeholder = { role: "bot", content: "__THINKING__" }
        let placeholderIndex;
        setMessages((prev) => {
            placeholderIndex = prev.length;
            return [...prev, placeholder];
        });
    
        try {
            const res = await fetch("/api/chat",
                {
                    method: "POST",
                    body: JSON.stringify({ message: messageInput }),
                });

            const data = await res.json();
            setMessages((prev) => {
                const updated = [...prev];
                
                updated[placeholderIndex] = { role: "bot", content: data.reply };
                return updated;
            });
        }
        catch (error) {
            setMessages((prev) => {
                const updated = [...prev];
                updated[placeholderIndex] = { role: "bot", content: "Something went wrong!"};
                return updated;
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
    <div className="fixed bottom-6 w-full flex justify-center px-4">
        <form
        className="relative border border-gray-600 rounded-lg px-4 py-2 w-full max-w-[700px] bg-[#111] flex items-center gap-2"
        >
        {/* Circle Upload Button */}
        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600">
            <img src="paperclip.png" alt="Paperclip Icon" className="w-4 h-4" />
        </div>

        {/* Text Input */}
        <textarea
            placeholder="Ask away!"
            rows={1}
            className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none pr-16 text-base"
        />

        {/* Send Button */}
        <div
            className="absolute bottom-1 right-1 bg-blue-500 text-white px-3 py-1 text-sm
                    rounded-bl-none rounded-lg shadow-sm hover:bg-blue-600"
        >
            Send
        </div>
        </form>
    </div>
    );
};