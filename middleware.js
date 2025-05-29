// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const referer = request.headers.get("referer") || "";
//   const isFromYourSite = referer.includes(request.nextUrl.hostname);

//   if (!isFromYourSite && request.nextUrl.pathname.startsWith("/api/icon")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/icon"],
// };
// middleware.js (in the root of your project)

import { NextResponse } from "next/server";

export function middleware(request) {
  const loggedInCookie = request.cookies.get("isLoggedIn");
  const userIsLoggedIn = loggedInCookie && loggedInCookie.value === "true";

  const PUBLIC_PATHS = ["/signin", "/_next", "/favicon.ico"]; // Paths that don't require login

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Case 1: User is logged in
  if (userIsLoggedIn) {
    // If logged in and trying to go to signin page, redirect to the main app page (/)
    if (path === "/signin") {
      url.pathname = "/"; // <--- Change this from "/dashboard" to "/"
      return NextResponse.redirect(url);
    }
    // If logged in and trying to go to any other page, allow
    return NextResponse.next();
  }
  // Case 2: User is NOT logged in
  else {
    // If NOT logged in and trying to access a public path, allow it
    if (PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath))) {
      return NextResponse.next();
    }
    // If NOT logged in and trying to access a protected path, redirect to signin
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
