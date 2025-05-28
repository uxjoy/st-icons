import { NextResponse } from "next/server";

export function middleware(request) {
  const referer = request.headers.get("referer") || "";
  const isFromYourSite = referer.includes(request.nextUrl.hostname);

  if (!isFromYourSite && request.nextUrl.pathname.startsWith("/api/icon")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/icon"],
};
