"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FabricaDocumentos() {
  // Estado para armazenar os dados do edital
  const [pregao, setPregao] = useState("05/2026");
  const [orgao, setOrgao] = useState("");
  const [objeto, setObjeto] = useState(
    "Aquisição de material de consumo e escritório",
  );

  // Estado para a Calculadora Financeira
  const [cnpj, setCnpj] = useState("");
  const [custo, setCusto] = useState("");
  const [margem, setMargem] = useState("20");

  // Cálculo financeiro em tempo real
  const custoNum = parseFloat(custo.replace(/\./g, "").replace(",", ".")) || 0;
  const margemNum = parseFloat(margem) || 0;
  const valorTotalNum = custoNum + custoNum * (margemNum / 100);

  // Formatação segura para a moeda brasileira
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorTotalNum);

  // Motor de busca automática via BrasilAPI
  const buscarCNPJ = async (valorDigitado: string) => {
    setCnpj(valorDigitado);
    const cnpjLimpo = valorDigitado.replace(/\D/g, "");

    if (cnpjLimpo.length === 14) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`,
        );
        const data = await response.json();

        if (data.razao_social) {
          setOrgao(data.razao_social);
        }
      } catch (error) {
        console.error("Falha ao comunicar com a Receita.");
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden font-sans">
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between border-r border-zinc-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-zinc-50 mb-8 tracking-tight">
            Lici<span className="text-blue-500">Pilot</span>
          </h1>
          <nav className="space-y-2 flex flex-col">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-zinc-800 hover:text-white"
              >
                Painel de Ação
              </Button>
            </Link>
            <Link href="/fabrica">
              <Button
                variant="ghost"
                className="w-full justify-start text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
              >
                Fábrica de Documentos
              </Button>
            </Link>
            <Link href="/certidoes">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-zinc-800 hover:text-white"
              >
                Cofre de Certidões
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-zinc-800 hover:text-white"
              >
                Construtor de Templates
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL - SPLIT VIEW */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topo da Fábrica */}
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Fábrica de Documentos
            </h2>
            <p className="text-xs text-zinc-500">
              Geração e montagem de propostas sem margem de erro.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-green-600 text-green-700 bg-green-50"
            >
              ✓ Dados Validados
            </Badge>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => alert("Pacote .ZIP gerado com sucesso!")}
            >
              Gerar Pacote (.ZIP)
            </Button>
          </div>
        </header>

        {/* Layout Dividido */}
        <div className="flex-1 flex overflow-hidden">
          {/* LADO ESQUERDO: FORMULÁRIO */}
          <section className="w-1/2 p-6 overflow-y-auto border-r border-zinc-200 bg-white space-y-6">
            {/* 1. Dados do Edital */}
            <Card className="border-zinc-200 shadow-none">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  1. Variáveis do Edital
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="cnpj"
                      className="text-xs font-semibold text-blue-700"
                    >
                      CNPJ do Órgão (Busca Automática)
                    </Label>
                    <Input
                      id="cnpj"
                      placeholder="Somente números"
                      value={cnpj}
                      onChange={(e) => buscarCNPJ(e.target.value)}
                      className="h-9 text-sm border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pregao" className="text-xs">
                      Número do Pregão
                    </Label>
                    <Input
                      id="pregao"
                      value={pregao}
                      onChange={(e) => setPregao(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="orgao" className="text-xs">
                    Nome do Órgão
                  </Label>
                  <Input
                    id="orgao"
                    value={orgao}
                    onChange={(e) => setOrgao(e.target.value)}
                    placeholder="Preenchido automaticamente via CNPJ"
                    className="h-9 text-sm bg-zinc-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="objeto" className="text-xs">
                    Objeto do Edital
                  </Label>
                  <Input
                    id="objeto"
                    value={objeto}
                    onChange={(e) => setObjeto(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Calculadora de Precificação */}
            <Card className="border-zinc-200 shadow-none">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  2. Calculadora da Proposta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="custo" className="text-xs">
                      Custo Base (R$)
                    </Label>
                    <Input
                      id="custo"
                      placeholder="Ex: 10000.50"
                      value={custo}
                      onChange={(e) => setCusto(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="margem" className="text-xs">
                      Margem Desejada (%)
                    </Label>
                    <Input
                      id="margem"
                      value={margem}
                      onChange={(e) => setMargem(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="total"
                      className="text-xs font-bold text-green-700"
                    >
                      Valor Final Fechado
                    </Label>
                    <Input
                      id="total"
                      value={valorFormatado}
                      readOnly
                      className="h-9 text-sm font-semibold bg-green-50 text-green-800 border-green-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Seleção de Anexos */}
            <Card className="border-zinc-200 shadow-none">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  3. Documentos a Gerar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc1" defaultChecked />
                  <label
                    htmlFor="doc1"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Proposta Comercial Timbrada
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc2" defaultChecked />
                  <label
                    htmlFor="doc2"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Declaração de Fatos Impeditivos
                  </label>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* LADO DIREITO: PREVIEW */}
          <section className="w-1/2 p-6 bg-zinc-200 overflow-y-auto flex flex-col items-center">
            <div className="w-[100%] max-w-[595px] min-h-[842px] bg-white shadow-md p-12 text-zinc-900 font-serif text-xs leading-relaxed flex flex-col justify-between border border-zinc-300">
              <div>
                <div className="border-b-2 border-zinc-900 pb-4 mb-8 text-center">
                  <h3 className="text-sm font-bold tracking-widest uppercase font-sans">
                    Sua Empresa de Licitações LTDA
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    CNPJ: 00.000.000/0001-00 • comercial@suaempresa.com.br
                  </p>
                </div>

                <h4 className="text-center font-bold text-sm uppercase underline mb-8 font-sans">
                  PROPOSTA COMERCIAL
                </h4>

                <div className="space-y-4 text-justify font-sans">
                  <p>
                    À Comissão Permanente de Licitação da{" "}
                    <strong>{orgao || "[Nome do Órgão]"}</strong>.
                  </p>
                  <p>
                    Apresentamos nossa proposta referente ao{" "}
                    <strong>Pregão nº {pregao || "[Número]"}</strong>, cujo
                    objeto é a <i>{objeto || "[Objeto]"}</i>.
                  </p>
                  <p>
                    O valor global da nossa proposta, englobando todos os custos
                    operacionais, impostos e frete, é de exatos{" "}
                    <strong>{valorFormatado}</strong>, com validade de 60 dias
                    assegurada.
                  </p>
                  <p className="pt-4">
                    Declaramos o pleno cumprimento dos requisitos de habilitação
                    exigidos no edital.
                  </p>
                </div>
              </div>

              <div className="text-center font-sans mt-16 pt-8 border-t border-zinc-300">
                <p className="font-bold">Representante Legal da Empresa</p>
                <p className="text-[10px] text-zinc-500">
                  Documento assinado digitalmente
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
