// FASE 2: endpoint de revalidação manual
// POST com body { secret, slug? }
// Chama revalidatePath('/catalogo') e revalidatePath(`/catalogo/${slug}`)
// Protegido por REVALIDATE_SECRET no .env
// O n8n chamará esta rota após inserir produto novo

import { NextResponse } from "next/server";

export async function POST() {
  // FASE 2: implementar lógica de revalidação
  return NextResponse.json(
    { message: "Revalidação será implementada na Fase 2" },
    { status: 501 }
  );
}
