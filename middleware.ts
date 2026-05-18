import { NextResponse, type NextRequest } from "next/server";
import { resolveRouteAccess, type Role } from "@/lib/rbac";

// TODO(phase-1d): Replace cookie-derived role with a signed session lookup
// against auth_sessions. The current implementation MUST NOT run in production
// — a user can forge `mentoriit_role=admin` from DevTools. Refuse to deploy
// until readRoleFromSession() is wired and the assertion below is removed.
const ROLE_COOKIE = "mentoriit_role";

function readRoleUnsafe(req: NextRequest): Role | null {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: unsigned cookie auth is dev-only. Wire signed session lookup (phase 1d).",
    );
  }
  const cookie = req.cookies.get(ROLE_COOKIE)?.value;
  return cookie === "student" || cookie === "mentor" || cookie === "admin"
    ? cookie
    : null;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const role = readRoleUnsafe(req);


  const result = resolveRouteAccess(pathname, role);
  if (result.allow) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = result.redirectTo;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
