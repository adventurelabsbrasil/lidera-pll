import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const memberPaths = [
  "/[clientId]",
  "/[clientId]/perfil",
  "/[clientId]/conteudo",
  "/[clientId]/conteudos-adquiridos",
];
const adminPaths = ["/admin", "/super-admin"];
const publicPaths = ["/", "/demo"];

function isMemberPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 1) return false;
  const clientId = parts[0];
  if (pathname === `/${clientId}` || pathname === `/${clientId}/login`)
    return true;
  if (
    pathname.startsWith(`/${clientId}/perfil`) ||
    pathname.startsWith(`/${clientId}/conteudo`) ||
    pathname.startsWith(`/${clientId}/conteudos-adquiridos`)
  )
    return true;
  return false;
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
}

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/demo")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const res = await updateSession(request);

  if (isPublicPath(pathname)) return res;

  if (isMemberPath(pathname)) {
    const parts = pathname.split("/").filter(Boolean);
    const clientId = parts[0];
    if (pathname === `/${clientId}/login`) return res;
    // Protected member routes: require auth; actual clientId check happens in layout/page
    return res;
  }

  if (isAdminPath(pathname)) {
    // Admin routes: role check happens in layout
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
