import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  Header,
  Footer,
} from "docx";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

  try {
    const edital = await prisma.edital.findUnique({
      where: { id },
      include: { itens: true },
    });

    // O modelo Empresa não está disponível no PrismaClient gerado neste projeto.
    // Mantém os valores padrão do documento até que esse modelo seja adicionado ao schema.
    const empresa = null;

    if (!edital)
      return NextResponse.json(
        { error: "Edital não encontrado" },
        { status: 404 },
      );

    const valorTotalFormatado =
      edital.valor && edital.valor > 0
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(edital.valor)
        : "Valor não divulgado (sob sigilo)";

    // Soma usando o valor cotado (com markup aplicado), ou cai para o estimado se não houver markup
    const somaTotalProposta = edital.itens.reduce((acc, item) => {
      const precoUnitario = item.valorCotado ?? item.valor ?? 0;
      return acc + (item.quantidade || 0) * precoUnitario;
    }, 0);

    const somaTotalPropostaFormatada =
      somaTotalProposta > 0
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(somaTotalProposta)
        : "A cotar";

    const linhasTabela = [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ text: "Item", alignment: AlignmentType.CENTER }),
            ],
            width: { size: 5, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: "Descrição" })],
            width: { size: 45, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({ text: "Qtd", alignment: AlignmentType.CENTER }),
            ],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Valor Unit.",
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Valor Total",
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      ...edital.itens.map((item, index) => {
        // Pega o valor com markup aplicado
        const precoUnitario = item.valorCotado ?? item.valor ?? 0;
        const valorTotalItem = (item.quantidade || 0) * precoUnitario;

        return new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: (index + 1).toString(),
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [new Paragraph({ text: item.descricao })],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: item.quantidade?.toString() || "1",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text:
                    precoUnitario > 0
                      ? `R$ ${precoUnitario.toFixed(2).replace(".", ",")}`
                      : "A cotar",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text:
                    valorTotalItem > 0
                      ? `R$ ${valorTotalItem.toFixed(2).replace(".", ",")}`
                      : "A cotar",
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        });
      }),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: empresa?.razaoSocial || "NOME DA SUA EMPRESA",
                      bold: true,
                      size: 24,
                    }),
                    new TextRun({
                      text: `\nCNPJ: ${empresa?.cnpj || "00.000.000/0000-00"}`,
                      size: 20,
                      break: 1,
                      color: "666666",
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${empresa?.endereco || "Endereço não cadastrado"} | Tel: ${empresa?.telefone || "-"}`,
                      size: 18,
                      color: "888888",
                    }),
                    new TextRun({
                      text: `\nBanco: ${empresa?.banco || "-"} | Agência: ${empresa?.agencia || "-"} | Conta: ${empresa?.conta || "-"} | PIX: ${empresa?.pix || "-"}`,
                      size: 18,
                      color: "888888",
                      break: 1,
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({ text: "" }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "PROPOSTA COMERCIAL",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: `Órgão: `, bold: true }),
                new TextRun({ text: edital.orgao }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Referência: `, bold: true }),
                new TextRun({ text: edital.numeroPregao }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Valor Estimado do Edital: `, bold: true }),
                new TextRun({ text: valorTotalFormatado }),
              ],
            }),
            new Paragraph({ text: "" }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: linhasTabela,
            }),

            new Paragraph({ text: "" }),

            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "VALOR TOTAL DA PROPOSTA: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: somaTotalPropostaFormatada,
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Validade da Proposta: 60 dias",
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="Proposta_${edital.numeroPregao.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao gerar documento" },
      { status: 500 },
    );
  }
}
