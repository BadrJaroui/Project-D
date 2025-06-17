export async function POST(request) {
  try {
    const { message } = await request.json();

    console.log(message);

    // 1. Input Validation: Check if the 'message' is provided
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return new Response(
        JSON.stringify({ error: "Bad Request: 'message' is required and must be a non-empty string." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. API Key Presence: Ensure the bearer token is set
    const bearerToken = process.env.BEARER_TOKEN;
    if (!bearerToken) {
      console.error("Server Error: BEARER_TOKEN environment variable is not set.");
      return new Response(
        JSON.stringify({ error: "Server Configuration Error: API authentication token is missing." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
        { "type": "collection", "id": "1868dae2-e210-44f5-8b85-044d39a2de3c" }
      ]
    };

    const openWebUiApiUrl = "http://localhost:3000/api/chat/completions";

    let response;
    try {
      response = await fetch(openWebUiApiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (fetchError) {
      // 3. Network/Fetch Errors: Catch errors during the fetch operation (e.g., network down, incorrect URL)
      console.error(`Network or Fetch Error contacting OpenWebUI API at ${openWebUiApiUrl}:`, fetchError);
      return new Response(
        JSON.stringify({ error: `Failed to connect to the OpenWebUI API. Please check the server status and URL. Details: ${fetchError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log the response status and potentially the raw body for debugging
    console.log(`OpenWebUI API Response Status: ${response.status} ${response.statusText}`);

    // 4. API Response Errors: Handle non-2xx HTTP statuses
    if (!response.ok) {
      let errorData = {};
      try {
        // Attempt to parse JSON error from the API
        errorData = await response.json();
        console.error("OpenWebUI API returned an error:", errorData);
      } catch (jsonParseError) {
        // If parsing fails, it might not be a JSON error response
        console.error("OpenWebUI API returned non-JSON error response:", await response.text());
        return new Response(
          JSON.stringify({ error: `OpenWebUI API error: ${response.status} ${response.statusText}. No detailed error message from API.` }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Provide more specific error messages based on the API's response
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or expired API key provided to OpenWebUI API." }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: "Not Found: The specified model or API endpoint was not found on OpenWebUI. Check your payload and API URL." }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: `Bad Request: OpenWebUI API rejected the request. Details: ${errorData.detail || JSON.stringify(errorData)}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Generic API error
        return new Response(
          JSON.stringify({ error: `OpenWebUI API error: ${response.status} ${response.statusText}. Details: ${errorData.detail || JSON.stringify(errorData)}` }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const data = await response.json();
    console.log("Response from OpenWebUI API:", data);

    // 5. API Response Data Structure: Check if the expected content exists.
    const replyContent = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    if (!replyContent) {
      console.warn("OpenWebUI API response did not contain expected content:", data);
      return new Response(
        JSON.stringify({ error: "OpenWebUI API returned a successful response, but no content was found in the expected format." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ reply: replyContent }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (overallError) {
    // Catch any unexpected errors that weren't handled by specific try/catch blocks
    console.error("An unexpected error occurred in POST function:", overallError);
    return new Response(
      JSON.stringify({ error: `An unexpected server error occurred: ${overallError.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
