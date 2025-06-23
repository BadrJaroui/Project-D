
import { clearAuthCookie } from "../../utils/Auth";

export async function POST(request) {
  try {
    const cookie = clearAuthCookie();

    return new Response(
      JSON.stringify({ success: true, message: "Logout successful" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      },
    );
  } catch (error) {
    console.error("Logout API error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error during logout" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
