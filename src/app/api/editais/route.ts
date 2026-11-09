import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const editais = await prisma.edital.findMany({
      orderBy: { createdAt: "desc" },
      include: { itens: true }, // A MÁGICA AQUI: Traz os itens junto com o edital
    });

    return NextResponse.json(editais);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar editais." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🛡️ O FILTRO DE SEGURANÇA:
    // Tenta converter o que chegou em número. Se der erro (porque era texto), vira null.
    const valorNumerico = parseFloat(body.valorEstimado);

    const novoEdital = await prisma.edital.create({
      data: {
        numeroPregao: body.numeroPregao,
        orgao: body.orgao,
        objeto: body.objeto,
        prazoLimite: new Date(body.prazoLimite),
        municipio: body.municipio,
        uf: body.uf,
        ...(isNaN(valorNumerico) ? {} : { valor: valorNumerico }),
        linkOriginal: body.linkOriginal,

        itens: {
          create: body.itens || [],
        },
      },
    });

    return NextResponse.json(novoEdital, { status: 201 });
  } catch (error) {
    console.error("Erro no Prisma:", error);
    return NextResponse.json(
      { error: "Falha ao gravar o edital." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    // O Prisma deleta o edital e todos os itens dele automaticamente (onDelete: Cascade)
    await prisma.edital.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json(
      { error: "Falha ao excluir o edital." },
      { status: 500 },
    );
  }
}
