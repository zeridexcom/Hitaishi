import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "hitaishi_session";

const PUBLIC_EXACT = new Set<string>([
  "/",
  "/checkout",
  "/login",
  "/privacy",
  "/terms",
  "/api/health",
  "/api/auth/demo",
  "/favicon.ico",
]);

const PUBLIC_PREFIXES = ["/_next/", "/api/webhooks/"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
