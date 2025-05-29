// app/api/auth/signin/route.js (Updated to set a cookie)

import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies for App Router

export async function POST(request) {
  const { username, password } = await request.json();

  const storedUsername = process.env.PRIVATE_API_USERNAME;
  const storedPassword = process.env.PRIVATE_API_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  if (username === storedUsername && password === storedPassword) {
    // Set a cookie upon successful login
    cookies().set("isLoggedIn", "true", {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
      // httpOnly: true, // Recommended for real authentication tokens, but complicates client-side JS access for logout demo
      // secure: process.env.NODE_ENV === 'production', // Use secure in production
    });

    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid username or password." },
      { status: 401 }
    );
  }
}
