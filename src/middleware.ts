import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./app/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/auth/confirm")) {
    return NextResponse.next();
  }
  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  const user = await updateSession(request);
  if (user == null) {
    const myUrl = new URL("/signin", request.nextUrl.origin);
    return NextResponse.redirect(myUrl);
  }
  NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin/:path*"],
};
