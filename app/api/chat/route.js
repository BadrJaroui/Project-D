export async function POST(request) {
  const { message } = await request.json();

  // Build the payload as required by the OpenWebUI API
  const payload = {
    model: "gemma3:latest",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    stream: false,
    files: [
        {"type": "collection", "id": "821286ac-b70f-4823-bb80-75e8b1918c4d"}
    ]

  };

  try {
    const response = await fetch("http://localhost:3000/api/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`, // Replace with your actual API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    console.log("Response from OpenWebUI API:", response);
    const data = await response.json();

    return Response.json({ reply: data.choices[0]?.message?.content || "No reply." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
