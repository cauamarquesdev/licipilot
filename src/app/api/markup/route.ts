import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { editalId, percentual } = await request.json();

    if (!editalId || percentual === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Busca todos os itens do edital
    const itemDelegate = (prisma as PrismaClient & { item: any }).item;

    const itens = await itemDelegate.findMany({
      where: { editalId },
    });

    // Fator de multiplicação (Ex: -15% vira 0.85 | +5% vira 1.05)
    const fator = 1 + Number(percentual) / 100;

    // Atualiza cada item aplicando a margem sobre o valor estimado do governo
    for (const item of itens) {
      if (item.valor !== null && item.valor > 0) {
        const novoValorUnitario = Number((item.valor * fator).toFixed(2));

        await itemDelegate.update({
          where: { id: item.id },
          data: { valorCotado: novoValorUnitario },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Markup:", error);
    return NextResponse.json(
      { error: "Erro ao aplicar markup" },
      { status: 500 },
    );
  }
}
