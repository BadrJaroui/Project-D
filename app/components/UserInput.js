import { useState } from "react";

export default function UserInput({ setReply }) {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const res = await fetch("/api/chat",
            {
                method: "POST",
                body: JSON.stringify({ message }),
            });

        const data = await res.json();
        setReply(data.reply);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }
    return <div>
        <form onSubmit={handleSubmit} className="relative border border-gray-600 rounded-lg px-4 py-2 w-80 h-24">
            <textarea
                type="text"
                placeholder="Ask away!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className=" resize-none focus:outline-none focus:ring-blue-500 pr-16 pb-10 overflow-y-auto" />
            <button
                type="submit"
                className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm
                               rounded-bl-none rounded-lg shadow-sm hover:bg-blue-600"
            >
                Send
            </button>
        </form>
    </div>
};
