import { useState } from "react";

export default function UserInput({ setReply }) {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/chat",
            {
                method: "POST",
                body: JSON.stringify({ message }),
            });

        const data = await res.json();
        setReply(data.reply);
    };
    return <div>
        <form onSubmit={handleSubmit}>
            <textarea
                type="text"
                placeholder="Ask away!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-600 rounded-lg px-4 py-2 w-80focus:outline-none focus:ring-blue-500"/>
        </form>
    </div>
};