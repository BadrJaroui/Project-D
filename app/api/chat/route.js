export async function POST(request) {
  try {
    const { message } = await request.json();

    console.log(message);

    if (!message || typeof message !== "string" || message.trim() === "") {
      return new Response(
        JSON.stringify({
          error:
            "Bad Request: 'message' is required and must be a non-empty string.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const bearerToken = process.env.BEARER_TOKEN;
    if (!bearerToken) {
      console.error(
        "Server Error: BEARER_TOKEN environment variable is not set.",
      );
      return new Response(
        JSON.stringify({
          error:
            "Server Configuration Error: API authentication token is missing.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.error(
        "Server Error: SLACK_WEBHOOK_URL environment variable is not set.",
      );
    }

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
        { "type": "collection", "id": "7cdcece0-c361-49ba-8774-6d5b1be67c3d" },
      ],
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
      console.error(
        `Network or Fetch Error contacting OpenWebUI API at ${openWebUiApiUrl}:`,
        fetchError,
      );

      if (slackWebhookUrl) {
        await sendSlackNotification(
          slackWebhookUrl,
          ` Error contacting OpenWebUI API: ${fetchError.message}\nUser message: \`${message}\``,
        );
      }
      return new Response(
        JSON.stringify({
          error:
            `Failed to connect to the OpenWebUI API. Please check the server status and URL. Details: ${fetchError.message}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(
      `OpenWebUI API Response Status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      let errorData = {};
      let errorMessageForSlack =
        `OpenWebUI API Error: ${response.status} ${response.statusText}`;
      try {
        errorData = await response.json();
        errorMessageForSlack += `. Details: ${
          errorData.detail || JSON.stringify(errorData)
        }`;
        console.error("OpenWebUI API returned an error:", errorData);
      } catch (jsonParseError) {
        console.error(
          "OpenWebUI API returned non-JSON error response:",
          await response.text(),
        );
        errorMessageForSlack +=
          `. No detailed error message from API (non-JSON response).`;
      }

      if (slackWebhookUrl) {
        await sendSlackNotification(
          slackWebhookUrl,
          ` ${errorMessageForSlack}\nUser message: \`${message}\``,
        );
      }

      if (response.status === 401) {
        return new Response(
          JSON.stringify({
            error:
              "Unauthorized: Invalid or expired API key provided to OpenWebUI API.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      } else if (response.status === 404) {
        return new Response(
          JSON.stringify({
            error:
              "Not Found: The specified model or API endpoint was not found on OpenWebUI. Check your payload and API URL.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      } else if (response.status === 400) {
        return new Response(
          JSON.stringify({
            error: `Bad Request: OpenWebUI API rejected the request. Details: ${
              errorData.detail || JSON.stringify(errorData)
            }`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      } else {
        return new Response(
          JSON.stringify({
            error:
              `OpenWebUI API error: ${response.status} ${response.statusText}. Details: ${
                errorData.detail || JSON.stringify(errorData)
              }`,
          }),
          {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const data = await response.json();
    console.log("Response from OpenWebUI API:", data);

    const replyContent = data.choices && data.choices[0] &&
      data.choices[0].message && data.choices[0].message.content;

    if (!replyContent) {
      console.warn(
        "OpenWebUI API response did not contain expected content:",
        data,
      );
      if (slackWebhookUrl) {
        await sendSlackNotification(
          slackWebhookUrl,
          ` OpenWebUI API returned success but no content.\nUser message: \`${message}\`\nAPI Response: \`\`\`json\n${
            JSON.stringify(data, null, 2)
          }\n\`\`\``,
        );
      }
      return new Response(
        JSON.stringify({
          error:
            "OpenWebUI API returned a successful response, but no content was found in the expected format.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (slackWebhookUrl) {
      const slackMessage =
        `🗣️ *User Query:* ${message}\n🤖 *AI Reply:* ${replyContent}`;
      await sendSlackNotification(slackWebhookUrl, slackMessage);
    }

    return new Response(
      JSON.stringify({ reply: replyContent }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (overallError) {
    console.error(
      "An unexpected error occurred in POST function:",
      overallError,
    );
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(
        process.env.SLACK_WEBHOOK_URL,
        ` An unexpected server error occurred: ${overallError.message}`,
      );
    }
    return new Response(
      JSON.stringify({
        error: `An unexpected server error occurred: ${overallError.message}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * @param {string} webhookUrl
 * @param {string} text
 */

async function sendSlackNotification(webhookUrl, text) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    console.log("Slack notification sent successfully.");
  } catch (slackError) {
    console.error("Failed to send Slack notification:", slackError);
  }
}
