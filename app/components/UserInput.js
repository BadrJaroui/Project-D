import { useState, useRef } from "react";

export default function UserInput({ setMessages }) {
  const [messageInput, setMessageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Submit chat message handler (your existing code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = messageInput.trim();
    if (!userMessage) return;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessageInput("");

    const placeholder = { role: "bot", content: "__THINKING__" };
    let placeholderIndex;
    setMessages((prev) => {
      placeholderIndex = prev.length;
      return [...prev, placeholder];
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[placeholderIndex] = { role: "bot", content: data.reply };
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[placeholderIndex] = {
          role: "bot",
          content: "Something went wrong!",
        };
        return updated;
      });
    }
  };

  // Handle Enter key send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle paperclip button click - triggers hidden file input click
  const handlePaperclipClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Upload file handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    // Add a message to show uploading status
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: `Uploading file "${file.name}"...` },
    ]);
    const uploadMsgIndex = (prevLength => prevLength)(setMessages.length || 0);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          // Do NOT set Content-Type manually with FormData!
        },
        body: formData,
      });

      const data = await res.json();

      // Replace the uploading message with success message
      setMessages((prev) => {
        const updated = [...prev];
        // Find last bot message containing 'Uploading file'
        const idx = updated.findIndex(
          (m, i) =>
            m.role === "bot" &&
            m.content.startsWith("Uploading file") &&
            i === updated.length - 1
        );
        if (idx !== -1) {
          updated[idx] = {
            role: "bot",
            content: `File "${file.name}" uploaded successfully!`,
          };
        }
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex(
          (m, i) =>
            m.role === "bot" &&
            m.content.startsWith("Uploading file") &&
            i === updated.length - 1
        );
        if (idx !== -1) {
          updated[idx] = {
            role: "bot",
            content: `Failed to upload file "${file.name}".`,
          };
        }
        return updated;
      });
    } finally {
      setUploading(false);
      // Reset the file input so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed bottom-6 w-full flex justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="relative border border-gray-600 rounded-lg px-4 py-2 w-full max-w-[700px] bg-[#111] flex items-center gap-2"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {/* Circle Upload Button */}
        <div
          onClick={handlePaperclipClick}
          className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600"
          title="Upload file"
        >
          <img src="paperclip.png" alt="Paperclip Icon" className="w-4 h-4" />
        </div>

        {/* Text Input */}
        <textarea
          placeholder="Ask away!"
          rows={1}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none pr-16 text-base"
          disabled={uploading}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={uploading}
          className="absolute bottom-1 right-1 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-none rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}