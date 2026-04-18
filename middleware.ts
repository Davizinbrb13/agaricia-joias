import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware passthrough — sem lógica de proteção no momento.
// Quando for necessário proteger /admin com Supabase Auth, adicione aqui:
//
// if (request.nextUrl.pathname.startsWith('/admin')) {
//   // Verificar sessão do Supabase Auth
//   // Redirecionar para login se não autenticado
// }

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
