"use client";

import { useState } from "react";

export default function UploadPDF() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Upload complete!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-2"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}