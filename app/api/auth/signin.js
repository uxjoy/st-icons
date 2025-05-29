// pages/api/auth/signin.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;
  const storedUsername = process.env.PRIVATE_API_USERNAME;
  const storedPassword = process.env.PRIVATE_API_PASSWORD;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // --- Crucial Debugging Step: Verify Loaded Env Vars ---
  // Temporarily add these logs to ensure your .env variables are being read by the server
  // Remove them in production!
  console.log("Attempting login:");
  console.log("Provided Username:", username);
  console.log("Stored Username (from .env):", storedUsername);
  console.log("Stored Password (from .env):", storedPassword);
  // If storedUsername/Password are undefined, your .env is not loading correctly.

  if (username === storedUsername && password === storedPassword) {
    const cookie = serialize("authToken", "true", {
      httpOnly: true,
      // THIS IS THE IMPORTANT PART: set 'secure' based on environment
      secure: process.env.NODE_ENV === "production", // true for HTTPS (production), false for HTTP (development)
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ message: "Login successful!" });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
}
