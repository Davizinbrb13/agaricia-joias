// FASE 2: proteger /admin com Supabase Auth
//
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
//
// export function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/admin')) {
//     // Verificar sessão do Supabase Auth
//     // Redirecionar para login se não autenticado
//   }
//   return NextResponse.next()
// }
//
// export const config = {
//   matcher: ['/admin/:path*'],
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
