export default function ChatReply({ reply }) {
    return <div>
        {reply && (
            <p className="mt-4 bg-gray-800 text-white p-4 rounded-lg w-80 text-sm">
                {reply}
            </p>
        )}
    </div>
}