
import { generateToken, setAuthCookie } from "../../utils/Auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username === process.env.USERNAME_LOGIN && password === process.env.PASSWORD) {

      const payload = { userId: "admin", username: username };
      const token = generateToken(payload);

      const cookie = setAuthCookie(null, token);

      return new Response(
        JSON.stringify({ success: true, message: "Login successful" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
          },
        },
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid Login" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error with request" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
}
