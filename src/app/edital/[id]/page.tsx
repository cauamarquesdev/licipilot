import { PrismaClient } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientMarkupBox from "@/components/ClientMarkupBox"; // Componente interativo do botão

const prisma = new PrismaClient();

const checklistPadrao = [
  { categoria: "Habilitação Jurídica", doc: "Contrato Social Atualizado" },
  {
    categoria: "Regularidade Fiscal",
    doc: "Certidão Negativa da Receita Federal / INSS",
  },
  {
    categoria: "Regularidade Fiscal",
    doc: "Certidão Negativa de Regularidade do FGTS (CRF)",
  },
  {
    categoria: "Regularidade Fiscal",
    doc: "Certidão Negativa Estadual e Municipal",
  },
  {
    categoria: "Regularidade Fiscal",
    doc: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
  },
  {
    categoria: "Qualificação Financeira",
    doc: "Balanço Patrimonial do último exercício",
  },
  {
    categoria: "Qualificação Financeira",
    doc: "Certidão Negativa de Falência e Concordata",
  },
  {
    categoria: "Declarações",
    doc: "Declaração de Inexistência de Fato Superveniente",
  },
  { categoria: "Declarações", doc: "Declaração de Não Emprego de Menor" },
];

export default async function SalaDeGuerra({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  const edital = await prisma.edital.findUnique({
    where: { id: resolvedParams.id },
    include: { itens: true },
  });

  if (!edital) {
    return (
      <div className="p-8 text-center text-red-500 font-bold text-xl">
        Edital não encontrado no banco de dados.
      </div>
    );
  }

  const formatarMoeda = (valor: number | null) => {
    if (!valor) return "Valor não divulgado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-zinc-100 font-sans p-8">
      {/* CABEÇALHO */}
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-start">
        <div>
          <Badge className="bg-blue-600 hover:bg-blue-700 mb-3 px-3 py-1">
            Sala de Guerra • LicitaPro
          </Badge>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {edital.numeroPregao}
          </h1>
          <p className="text-lg text-zinc-600 mt-1">{edital.orgao}</p>
          {edital.municipio && edital.uf && (
            <p className="text-sm font-medium text-zinc-500 mt-1">
              📍 {edital.municipio} - {edital.uf}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 text-sm px-4 py-2"
          >
            Valor Estimado: {formatarMoeda(edital.valor)}
          </Badge>
          <div className="flex gap-2">
            {edital.linkOriginal && (
              <a
                href={edital.linkOriginal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-zinc-200 text-zinc-800 px-4 py-2 rounded-md font-medium hover:bg-zinc-300 transition-colors shadow-sm"
              >
                Edital Original ↗
              </a>
            )}
            <a
              href={`/api/proposta?id=${edital.id}`}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Gerar Proposta (Word) 📄
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: OBJETOS E DOCUMENTOS */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
              <CardTitle className="text-base text-zinc-800">
                Resumo do Objeto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm text-zinc-700 leading-relaxed bg-white">
              {edital.objeto}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200 flex-1">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
              <CardTitle className="text-base text-zinc-800">
                Checklist de Documentação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              <p className="text-xs text-zinc-500 mb-4 pb-2 border-b border-zinc-100">
                Lembre-se de confirmar no edital se o órgão exige documentos
                extras.
              </p>
              <div className="space-y-3">
                {checklistPadrao.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 leading-tight">
                        {item.doc}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                        {item.categoria}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: ITENS A COTAR */}
        <Card className="md:col-span-2 shadow-sm border-zinc-200 h-fit">
          <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-zinc-800">
              Itens e Quantidades para Cotação
            </CardTitle>
            <Badge className="bg-zinc-200 text-zinc-800 hover:bg-zinc-200">
              {edital.itens.length} itens encontrados
            </Badge>
          </CardHeader>
          <CardContent className="p-4 bg-white">
            {/* PAINEL DO MARKUP MÁGICO */}
            <ClientMarkupBox editalId={edital.id} />

            {edital.itens.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                Nenhum item foi detalhado no portal do governo para este edital.
                Será necessário ler o PDF.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/50">
                    <TableHead className="w-[10%] text-center">Item</TableHead>
                    <TableHead className="w-[40%]">
                      Descrição Exata do Governo
                    </TableHead>
                    <TableHead className="w-[15%] text-center">
                      Quantidade
                    </TableHead>
                    <TableHead className="w-[15%] text-right">
                      V. Unitário (Cotado)
                    </TableHead>
                    <TableHead className="w-[20%] text-right font-bold text-zinc-900">
                      V. Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {edital.itens.map((item, index) => {
                    // Prioriza o valor cotado (Markup), se não houver usa o estimado do governo
                    const precoUnitario = item.valorCotado ?? item.valor ?? 0;
                    const valorTotalItem =
                      (item.quantidade || 0) * precoUnitario;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-semibold text-zinc-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-xs text-zinc-800">
                          {item.descricao}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 font-bold"
                          >
                            {item.quantidade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-zinc-600 font-medium">
                          {formatarMoeda(precoUnitario)}
                          {item.valorCotado !== null && (
                            <span className="block text-[10px] text-blue-600 font-bold">
                              Com Markup
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm text-zinc-900 font-bold bg-zinc-50/30">
                          {formatarMoeda(
                            valorTotalItem > 0 ? valorTotalItem : null,
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
