import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const termo = searchParams.get("q");
  const filtroUF = searchParams.get("uf");
  const filtroDias = searchParams.get("dias");

  if (!termo) {
    return NextResponse.json({ error: "Termo não informado" }, { status: 400 });
  }

  try {
    // 1. SEPARAMOS OS ALVOS: Uma URL para Editais/Pregões e outra para Dispensas
    const urlEditais = `https://pncp.gov.br/api/search/?q=${encodeURIComponent(termo)}&tipos_documento=edital&ordenacao=-data&tamanhoPagina=50`;
    const urlDispensas = `https://pncp.gov.br/api/search/?q=${encodeURIComponent(termo)}&tipos_documento=aviso_contratacao_direta&ordenacao=-data&tamanhoPagina=50`;

    const headers = {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    };

    // 2. DISPARO DUPLO: Faz as duas buscas ao mesmo tempo para não deixar a tela lenta
    const [resEditais, resDispensas] = await Promise.all([
      fetch(urlEditais, { method: "GET", headers, cache: "no-store" }),
      fetch(urlDispensas, { method: "GET", headers, cache: "no-store" }),
    ]);

    let itensGoverno: any[] = [];

    // Junta os Pregões
    if (resEditais.ok) {
      const dataE = await resEditais.json();
      itensGoverno = itensGoverno.concat(
        dataE.items || dataE.data || dataE || [],
      );
    }

    // Junta as Dispensas Rápidas
    if (resDispensas.ok) {
      const dataD = await resDispensas.json();
      itensGoverno = itensGoverno.concat(
        dataD.items || dataD.data || dataD || [],
      );
    }

    console.log(
      `[🔎 BUSCA] O governo enviou ${itensGoverno.length} resultados brutos para "${termo}".`,
    );

    const hoje = new Date();
    const dataMaxima =
      filtroDias && filtroDias !== "Todos"
        ? new Date(hoje.getTime() + parseInt(filtroDias) * 24 * 60 * 60 * 1000)
        : null;

    const editaisAtivos = itensGoverno.filter((item: any) => {
      const ufEdital = item.unidadeOrgao?.ufSigla || item.uf || "-";

      if (filtroUF && filtroUF !== "Todos" && ufEdital !== filtroUF) {
        return false;
      }

      const dataLimiteString =
        item.data_fim_recebimento_propostas ||
        item.data_abertura_proposta ||
        item.data_fim_vigencia;
      const dataPublicacaoString =
        item.data_publicacao_pncp || item.data_atualizacao_pncp;

      if (dataLimiteString) {
        const dataLim = new Date(dataLimiteString);
        if (dataLim < hoje) return false;
        if (dataMaxima && dataLim > dataMaxima) return false;
      } else {
        if (dataPublicacaoString) {
          const pubDate = new Date(dataPublicacaoString);
          const diasPublicado =
            (hoje.getTime() - pubDate.getTime()) / (1000 * 3600 * 24);
          if (diasPublicado > 5) return false;
        }
      }

      return true;
    });

    console.log(
      `[🎯 FILTRO] Após filtrar os vencidos/UF, sobraram ${editaisAtivos.length} oportunidades ATIVAS.`,
    );

    const editaisRicos = Array.isArray(editaisAtivos)
      ? editaisAtivos.slice(0, 15).map((item: any) => {
          const anoCompra = item.ano || new Date().getFullYear().toString();
          const sequencialCompra = item.numero_sequencial || "";
          const cnpjOrgao = item.orgao_cnpj || "";

          const objetoTexto =
            item.description ||
            item.objetoCompra ||
            item.objeto ||
            "Descrição não detalhada no portal.";

          return {
            numeroPregao:
              item.title || item.numero_controle_pncp || `Ref. PNCP`,
            orgao: item.orgao_nome || "Órgão não identificado",
            uf: item.uf || "-",
            municipio: item.municipio_nome || "Não informado",
            objeto: objetoTexto,
            dataPublicacao:
              item.data_publicacao_pncp || new Date().toISOString(),
            dataAbertura:
              item.data_fim_recebimento_propostas ||
              item.data_abertura_proposta ||
              item.data_inicio_vigencia ||
              item.data_publicacao_pncp ||
              null,
            valorEstimado: item.valor_global || item.valorTotalEstimado || 0,

            linkOriginal:
              cnpjOrgao && anoCompra && sequencialCompra
                ? `https://pncp.gov.br/app/editais/${cnpjOrgao}/${anoCompra}/${sequencialCompra}`
                : "",

            cnpj: cnpjOrgao,
            ano: anoCompra,
            sequencial: sequencialCompra,
          };
        })
      : [];

    return NextResponse.json(editaisRicos);
  } catch (error) {
    console.error("Falha na Busca:", error);
    return NextResponse.json({ error: "Falha na API." }, { status: 500 });
  }
}
