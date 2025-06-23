
import { getAuthTokenFromRequest, verifyToken } from "../../utils/Auth";

export async function GET(request) {
  try {
    const authToken = getAuthTokenFromRequest(request);

    if (!authToken) {
      return new Response(
        JSON.stringify({ isAuthenticated: false, message: "No token found." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const decoded = verifyToken(authToken);

    if (decoded) {
      return new Response(
        JSON.stringify({ isAuthenticated: true, user: decoded }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({ isAuthenticated: false, message: "Invalid token." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Check Auth API error:", error);
    return new Response(
      JSON.stringify({ isAuthenticated: false, message: "Server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
