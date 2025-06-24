// pages/uploadpage/index.js or app/uploadpage/page.js
"use client";

import { useState, useEffect } from "react";
import TopBanner from "../components/TopBanner";
import { useRouter } from "next/navigation";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/check-auth");
        if (!response.ok) {
          console.log("Not logged in or session expired.");
          router.replace("/loginPage");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        router.replace("/loginPage");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  useEffect(() => {
    if (file && status === "Please select a file first.") {
      setStatus("");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        e.target.reset();
        setFile(null);
      } else {
        const errorData = await res.json();
        if (res.status === 401) {
          setStatus("Unauthorized. Please log in again.");
          router.replace("/loginPage");
        } else {
          setStatus(
            `Error uploading file: ${errorData.message || res.statusText}`
          );
        }
      }
    } catch (err) {
      setStatus("File uploaded succesful")
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />

      <div className="flex-1 flex items-center justify-center">
        <div className="p-11 rounded-2xl bg-white dark:bg-black">
          <div className="flex text-black dark:text-white font-semibold justify-left">
            Upload files (PDF)
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-4 p-4 "
          >
            <label className=" cursor-pointer bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl">
              Select file
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="flex bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl justify-center"
            >
              Upload
            </button>
          </form>
          {file && (
            <p className="p-2 text-black dark:text-white rounded-2xl font-semibold border border-black/50 dark:border-white/50 shadow-inner mt-1">
              Selected file: <span>{file.name}</span>
            </p>
          )}
          {status && (
            <p className="p-2 text-black dark:text-white rounded-2xl font-semibold border border-black/50 dark:border-white/50 shadow-inner mt-1">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
