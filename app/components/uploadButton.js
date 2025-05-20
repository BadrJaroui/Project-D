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
    }
}