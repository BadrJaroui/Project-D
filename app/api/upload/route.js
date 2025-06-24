import { NextResponse } from "next/server";
import fetch from "node-fetch";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());


    const openwebuiFormData = new FormData();
    openwebuiFormData.append("file", new Blob([buffer], { type: file.type }), file.name);

    const openwebuiRes = await fetch("http://localhost:3000/api/v1/files/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`,
      },
      body: openwebuiFormData,
    });

    if (!openwebuiRes.ok) {
      const errorBody = await openwebuiRes.text();
      return NextResponse.json({
        error: "Failed to upload to OpenWebUI",
        details: errorBody,
      }, { status: 500 });
    }

    const openwebuiResponseData = await openwebuiRes.json();
    const fileID = openwebuiResponseData.id;

    const knowledgeId = '7cdcece0-c361-49ba-8774-6d5b1be67c3d'
    const addToCollectionRes = await fetch(`http://localhost:3000/api/v1/knowledge/${knowledgeId}/file/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileID }),
    });

    if (!addToCollectionRes.ok) {
      const errorBody = await addToCollectionRes.text();
      return NextResponse.json({
        error: "Failed to add file to collection",
        details: errorBody,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      filename,
      openwebuiResponse: openwebuiResponseData,
    });
  } catch (err) {
    console.error("Upload route error:", err);
  }
}
