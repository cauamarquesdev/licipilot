"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Edital = {
  id?: string;
  numeroPregao: string;
  orgao: string;
  objeto: string;
  prazoLimite: string;
  municipio?: string;
  uf?: string;
  dataAbertura?: string;
  valorFormatado?: string;
  linkOriginal?: string;
  // + NOVOS CAMPOS
  cnpj?: string;
  ano?: string;
  sequencial?: string;
};

export default function Dashboard() {
  const [termoBusca, setTermoBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultadosGoverno, setResultadosGoverno] = useState<Edital[]>([]);
  const [editaisSalvos, setEditaisSalvos] = useState<Edital[]>([]);
  const [carregandoMesa, setCarregandoMesa] = useState(true);
  const [filtroUF, setFiltroUF] = useState("Todos");
  const [filtroDias, setFiltroDias] = useState("Todos");

  const carregarEditais = async () => {
    try {
      const response = await fetch("/api/editais");
      if (response.ok) {
        const dados = await response.json();
        setEditaisSalvos(dados);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    } finally {
      setCarregandoMesa(false);
    }
  };

  useEffect(() => {
    carregarEditais();
  }, []);

  const pesquisarNoGoverno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoBusca) return;

    setBuscando(true);
    setResultadosGoverno([]);

    try {
      const response = await fetch(`/api/pncp?q=${termoBusca}&uf=${filtroUF}&dias=${filtroDias}`);

      if (response.ok) {
        const dadosReais = await response.json();

        const editaisParaTela = dadosReais.map((edital: any) => {
          // Formata datas
          const formatarData = (isoDate: string) => {
            if (!isoDate) return "A definir";
            return new Date(isoDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          };

          // Formata Moeda Brasileira
          const formatarValor = (valor: number) => {
            if (!valor) return "Valor sob sigilo";
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(valor);
          };

          return {
            numeroPregao: edital.numeroPregao,
            orgao: edital.orgao,
            objeto: edital.objeto,
            municipio: edital.municipio,
            uf: edital.uf,
            linkOriginal: edital.linkOriginal,
            prazoLimite: formatarData(edital.dataPublicacao),
            dataAbertura: formatarData(edital.dataAbertura),
            valorFormatado: formatarValor(edital.valorEstimado),
            // + REPASSA OS IDs:
            cnpj: edital.cnpj,
            ano: edital.ano,
            sequencial: edital.sequencial,
          };
        });

        setResultadosGoverno(editaisParaTela);
      }
    } catch (error) {
      console.error("Falha na busca:", error);
    } finally {
      setBuscando(false);
    }
  };

  // 3. CAPTURAR E ABRIR A SALA DE GUERRA
  const capturarParaMesa = async (editalEscolhido: Edital) => {
    try {
      let itensReais = [];

      if (
        editalEscolhido.cnpj &&
        editalEscolhido.ano &&
        editalEscolhido.sequencial
      ) {
        const resItens = await fetch(
          `/api/pncp/itens?cnpj=${editalEscolhido.cnpj}&ano=${editalEscolhido.ano}&seq=${editalEscolhido.sequencial}`,
        );
        if (resItens.ok) {
          itensReais = await resItens.json();
        }
      }

      // Constrói o link oficial blindado que testamos na etapa anterior
      const linkForte =
        editalEscolhido.cnpj &&
        editalEscolhido.ano &&
        editalEscolhido.sequencial
          ? `https://pncp.gov.br/app/editais/${editalEscolhido.cnpj}/${editalEscolhido.ano}/${editalEscolhido.sequencial}`
          : editalEscolhido.linkOriginal;

      const payloadBanco = {
        numeroPregao: editalEscolhido.numeroPregao,
        orgao: editalEscolhido.orgao,
        objeto: editalEscolhido.objeto,
        prazoLimite: new Date().toISOString(),
        municipio: editalEscolhido.municipio,
        uf: editalEscolhido.uf,
        valorEstimado: editalEscolhido.valorFormatado,
        linkOriginal: linkForte,
        itens: itensReais,
      };

      const response = await fetch("/api/editais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBanco),
      });

      if (response.ok) {
        // Pega os dados do edital que acabou de nascer no seu banco de dados
        const editalSalvo = await response.json();

        setResultadosGoverno(
          resultadosGoverno.filter(
            (e) => e.numeroPregao !== editalEscolhido.numeroPregao,
          ),
        );
        carregarEditais();

        // O PULO DO GATO: Abre a aba na SUA nova tela interna usando o ID do banco
        window.open(`/edital/${editalSalvo.id}`, "_blank");
      }
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
    }
  };

  // 4. EXCLUIR DA MESA
  const excluirDaMesa = async (idParaDeletar: string) => {
    // Pede uma confirmação rápida para não excluir sem querer
    if (
      !window.confirm("Tem certeza que deseja excluir este edital da sua mesa?")
    )
      return;

    try {
      const response = await fetch(`/api/editais?id=${idParaDeletar}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove da tela imediatamente sem precisar recarregar a página
        setEditaisSalvos(editaisSalvos.filter((e) => e.id !== idParaDeletar));
      } else {
        alert("Erro ao excluir o edital.");
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
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
                className="w-full justify-start text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
              >
                Painel de Ação
              </Button>
            </Link>
            <Link href="/fabrica">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-zinc-800 hover:text-white"
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
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
              Radar e Captação
            </h2>
            <p className="text-zinc-500 mt-1">
              Busque oportunidades estratégicas pelo Brasil afora.
            </p>
          </div>
        </header>

        {/* MOTOR DE BUSCA */}
        <Card className="mb-6 border-zinc-200 shadow-sm">
          <CardContent className="p-4">
            <form onSubmit={pesquisarNoGoverno} className="flex gap-3">
              <Input
                placeholder="Ex: kit recém-nascido, enxoval, fraldas..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="flex-1 h-10 border-blue-200 focus-visible:ring-blue-500 text-base"
              />
              <Button
                type="submit"
                disabled={buscando}
                className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-8 font-medium"
              >
                {buscando ? "Consultando PNCP..." : "Buscar no Governo"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* PAINEL DE FILTROS AVANÇADOS */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <select 
              value={filtroUF} 
              onChange={(e) => setFiltroUF(e.target.value)}
              className="flex-1 p-2.5 border border-zinc-200 rounded-lg bg-zinc-50 text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">🌎 Todos os Estados</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="GO">Goiás (GO)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="BA">Bahia (BA)</option>
              <option value="MA">Maranhão (MA)</option>
              <option value="PB">Paraíba (PB)</option>
              <option value="PE">Pernambuco (PE)</option>
              <option value="CE">Ceará (CE)</option>
            </select>

            <select 
              value={filtroDias} 
              onChange={(e) => setFiltroDias(e.target.value)}
              className="flex-1 p-2.5 border border-zinc-200 rounded-lg bg-zinc-50 text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">⏳ Qualquer Prazo (Ativos)</option>
              <option value="7">🔥 Abrem em até 7 dias</option>
              <option value="15">📅 Abrem em até 15 dias</option>
              <option value="30">📆 Abrem em até 30 dias</option>
            </select>
          </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* COLUNA ESQUERDA: RADAR */}
          <Card className="w-[60%] flex flex-col shadow-sm border-zinc-200 overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
              <CardTitle className="text-sm font-semibold text-zinc-800 flex items-center justify-between">
                <span>Resultados Oficiais do Governo</span>
                {resultadosGoverno.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700">
                    {resultadosGoverno.length} encontrados
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto bg-white">
              {resultadosGoverno.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-400 p-8 text-center">
                  <p className="text-sm">
                    Os resultados com valores e prazos aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {resultadosGoverno.map((edital, index) => (
                    <div
                      key={index}
                      className="p-5 hover:bg-zinc-50 transition-colors flex flex-col gap-3"
                    >
                      {/* Topo do Card: Localidade e Botão */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-base text-zinc-900">
                              {edital.numeroPregao}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-zinc-100 text-zinc-600 text-[10px] uppercase border-zinc-200"
                            >
                              📍 {edital.municipio} - {edital.uf}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-zinc-700">
                            {edital.orgao}
                          </p>
                        </div>
                        <Button
                          onClick={() => capturarParaMesa(edital)}
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
                        >
                          + Capturar
                        </Button>
                      </div>

                      {/* Objeto/Pedido da Prefeitura */}
                      <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100 text-xs text-zinc-600">
                        <strong className="text-zinc-800 mr-1">Objeto:</strong>
                        {edital.objeto}
                      </div>

                      {/* Rodapé do Card: Datas, Valores e Link */}
                      <div className="flex flex-wrap gap-2 items-center justify-between mt-1">
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50/50 text-blue-700 font-medium"
                          >
                            Abertura: {edital.dataAbertura}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700 font-bold border border-green-200"
                          >
                            💰 {edital.valorFormatado}
                          </Badge>
                        </div>

                        {edital.linkOriginal && (
                          <a
                            href={edital.linkOriginal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-blue-600 hover:underline"
                          >
                            Ver no Portal Oficial ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* COLUNA DIREITA: MESA DE TRABALHO */}
          <Card className="w-[40%] flex flex-col shadow-sm border-zinc-200 overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
              <CardTitle className="text-sm font-semibold text-zinc-800">
                Mesa de Trabalho (Seus Projetos)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto bg-white">
              {carregandoMesa ? (
                <div className="p-8 text-center text-sm text-zinc-500">
                  Lendo banco de dados...
                </div>
              ) : editaisSalvos.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-400 p-8 text-center">
                  <p className="text-sm">Nenhum projeto capturado ainda.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {editaisSalvos.map((edital: any) => (
                    <div key={edital.id} className="p-4 bg-green-50/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-zinc-900">
                          {edital.numeroPregao}
                        </span>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 text-[10px]"
                          >
                            SALVO
                          </Badge>
                          <button
                            onClick={() =>
                              edital.id && excluirDaMesa(edital.id)
                            }
                            className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium px-1"
                            title="Remover edital"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-zinc-700 mb-3">
                        {edital.orgao}
                      </p>

                      {/* Exibição dos Itens Extraídos */}
                      {edital.itens && edital.itens.length > 0 && (
                        <div className="mb-4 bg-white border border-zinc-200 rounded-md p-2">
                          <p className="text-xs font-semibold text-zinc-800 mb-2 border-b border-zinc-100 pb-1">
                            📦 Itens Identificados ({edital.itens.length}):
                          </p>
                          <ul className="space-y-1">
                            {edital.itens
                              .slice(0, 3)
                              .map((item: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="text-[11px] text-zinc-600 flex justify-between"
                                >
                                  <span className="truncate pr-2">
                                    • {item.descricao}
                                  </span>
                                  <span className="font-medium shrink-0">
                                    {item.quantidade} un.
                                  </span>
                                </li>
                              ))}
                            {edital.itens.length > 3 && (
                              <li className="text-[10px] text-blue-600 font-medium italic mt-1">
                                + {edital.itens.length - 3} outros itens...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <Link href="/fabrica">
                        <Button className="w-full h-8 text-xs bg-zinc-900 hover:bg-zinc-800">
                          Montar Proposta Comercial
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
