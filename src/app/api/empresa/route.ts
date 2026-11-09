import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// The generated Prisma client currently does not expose the empresa delegate
// in its TypeScript type, although the model is available at runtime.
const empresaModel = (prisma as any).empresa;
export const dynamic = "force-dynamic";

// Busca os dados da empresa
export async function GET() {
  try {
    const empresa = await empresaModel.findFirst();
    return NextResponse.json(empresa || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar empresa" },
      { status: 500 },
    );
  }
}

// Salva ou atualiza os dados
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const empresaExistente = await empresaModel.findFirst();

    let empresa;
    if (empresaExistente) {
      empresa = await empresaModel.update({
        where: { id: empresaExistente.id },
        data,
      });
    } else {
      empresa = await empresaModel.create({ data });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return NextResponse.json(
      { error: "Erro ao salvar empresa" },
      { status: 500 },
    );
  }
}
