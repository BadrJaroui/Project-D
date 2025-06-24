import { useRef, useState } from "react";
import { useBreathing } from "./BreathingContext";

export default function UserInput({ setMessages, setShowIntro }) {
  const [messageInput, setMessageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  // Add a new state for chat message loading
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { setBackgroundPulse } = useBreathing();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = messageInput.trim();
    if (!userMessage) return;

    // Set isLoading to true at the start of the submission
    setIsLoading(true);
    setBackgroundPulse(true);

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
    } finally {
      // Set isLoading to false when the submission is complete (success or error)
      setIsLoading(false);
      setBackgroundPulse(false);
    }
  };

  const handleKeyDown = (e) => {
    // Disable sending with Enter key if loading or uploading
    if (e.key === "Enter" && !e.shiftKey && !isLoading && !uploading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFocus = () => {
    if (setShowIntro) setShowIntro(false);
  };

  const handlePaperclipClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true); // `uploading` state is already well-defined for file uploads

    const formData = new FormData();
    formData.append("file", file);

    // Show uploading status
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: `Uploading file "${file.name}"...` },
    ]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: formData,
      });

      const data = await res.json();

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed bottom-6 w-full flex justify-center px-4 z-10">
      <form
        onSubmit={handleSubmit}
        className="relative border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full max-w-[700px] bg-white dark:bg-[#111] flex items-center gap-2"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          // Disable file input if currently uploading or submitting a chat message
          disabled={uploading || isLoading}
        />

        {/* Textarea */}
        <textarea
          placeholder="Ask away!"
          rows={1}
          value={messageInput}
          onFocus={handleFocus}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none overflow-auto no-scrollbar bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none pr-16 text-base"
          // Disable textarea if currently uploading or submitting a chat message
          disabled={uploading || isLoading}
        />

        {/* Send Button */}
        <button
          type="submit"
          // Disable send button if currently uploading or submitting a chat message
          disabled={uploading || isLoading}
          className="absolute bottom-1 right-1 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-none rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
