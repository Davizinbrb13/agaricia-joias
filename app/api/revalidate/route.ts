// FASE 2: endpoint de revalidação manual
// POST com body { secret, slug? }
// Chama revalidatePath('/catalogo') e revalidatePath(`/catalogo/${slug}`)
// Protegido por REVALIDATE_SECRET no .env
// O n8n chamará esta rota após inserir produto novo

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug } = body;

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Unauthorized. Token inválido ou ausente." },
        { status: 401 }
      );
    }

    revalidatePath("/");
    revalidatePath("/catalogo");

    if (slug) {
      revalidatePath(`/catalogo/${slug}`);
    }

    return NextResponse.json(
      { 
        revalidated: true, 
        message: "Cache revalidado com sucesso", 
        slug: slug || null 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na rota de revalidação:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao tentar revalidar o cache" },
      { status: 500 }
    );
  }
}
