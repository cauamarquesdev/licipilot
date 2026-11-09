import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get("cnpj");
  const ano = searchParams.get("ano");
  const seq = searchParams.get("seq");

  if (!cnpj || !ano || !seq) {
    return NextResponse.json(
      { error: "Faltam chaves de busca" },
      { status: 400 },
    );
  }

  try {
    // O SEGREDO ESTÁ AQUI: Adicionamos pagina=1 e tamanhoPagina=500
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/${ano}/${seq}/itens?pagina=1&tamanhoPagina=500`;

    const response = await fetch(url);
    if (!response.ok) return NextResponse.json([]);

    const data = await response.json();

    // TRAVA BLINDADA: Garante que vamos achar a lista, não importa como o governo empacote
    const listaBruta = Array.isArray(data)
      ? data
      : data.items || data.data || [];

    const itensExatos = listaBruta.map((item: any) => ({
      descricao:
        item.descricao || item.materialOuServicoNome || "Item sem descrição",
      quantidade: item.quantidade || 1,
      valor: item.valorUnitarioEstimado || item.valorTotalEstimado || 0,
    }));

    return NextResponse.json(itensExatos);
  } catch (error) {
    console.error("Erro ao buscar itens do governo:", error);
    return NextResponse.json([]);
  }
}
