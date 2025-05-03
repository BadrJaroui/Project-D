export default function ChatReply({ messages }) {
    return (
        <div className="flex flex-col space-y-3">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <p className={`${msg.role === "user" ? "bg-blue-600" : "bg-gray-800"} text-white p-3 rounded-xl max-w-[70%] text-sm`}>
                        {msg.content}
                    </p>
                </div>
            ))}
        </div >
    );
}

