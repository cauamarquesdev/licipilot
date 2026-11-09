import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function GerenciadorTemplates() {
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
            <Link href="/templates">
              <Button
                variant="ghost"
                className="w-full justify-start text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
              >
                Construtor de Templates
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Cabeçalho */}
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Construtor de Templates
            </h2>
            <p className="text-xs text-zinc-500">
              Edição estruturada de documentos base com variáveis dinâmicas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-zinc-300">
              Descartar Alterações
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Salvar Template (v2.0)
            </Button>
          </div>
        </header>

        {/* MESA DE EDIÇÃO */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6 bg-zinc-50">
          {/* LADO ESQUERDO: O CANVAS DE EDIÇÃO */}
          <Card className="flex-1 shadow-sm border-zinc-200 flex flex-col">
            <CardHeader className="bg-white border-b border-zinc-100 py-3 flex flex-row items-center justify-between">
              <Input
                defaultValue="Declaração de Cumprimento do Art. 7º (Trabalho do Menor)"
                className="w-2/3 font-semibold text-zinc-800 border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:ring-0 shadow-none -ml-3"
              />
              <Badge variant="outline" className="bg-zinc-100 text-zinc-600">
                Categoria: Habilitação
              </Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Barra de Ferramentas Simulada */}
              <div className="bg-zinc-100 border-b border-zinc-200 p-2 flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 font-bold">
                  B
                </Button>
                <Button variant="ghost" size="sm" className="h-8 italic">
                  I
                </Button>
                <Button variant="ghost" size="sm" className="h-8 underline">
                  U
                </Button>
                <div className="w-px h-6 bg-zinc-300 mx-1 my-auto"></div>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Alinhar
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Lista
                </Button>
              </div>

              {/* Área de Texto com Tags Visuais (Simulação) */}
              <div className="p-8 flex-1 overflow-y-auto bg-white">
                <p className="text-sm text-zinc-800 leading-loose text-justify font-serif">
                  A empresa{" "}
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                    {"{{EMPRESA_RAZAO_SOCIAL}}"}
                  </span>
                  , inscrita no CNPJ sob o nº{" "}
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                    {"{{EMPRESA_CNPJ}}"}
                  </span>
                  , por intermédio de seu representante legal, declara, para
                  fins do disposto no inciso V do art. 27 da Lei nº 8.666/93 e
                  exigências do Edital do Pregão nº{" "}
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                    {"{{EDITAL_NUMERO}}"}
                  </span>{" "}
                  promovido por{" "}
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                    {"{{ORGAO_NOME}}"}
                  </span>
                  , que não emprega menor de dezoito anos em trabalho noturno,
                  perigoso ou insalubre e não emprega menor de dezesseis anos.
                </p>
                <p className="text-sm text-zinc-800 leading-loose text-justify font-serif mt-4">
                  Ressalva ainda, que não emprega menor na condição de aprendiz.
                </p>
                <div className="mt-12 text-center text-sm font-serif">
                  <p>
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                      {"{{DATA_CIDADE}}"}
                    </span>
                    ,{" "}
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                      {"{{DATA_EXTENSO}}"}
                    </span>
                  </p>
                  <p className="mt-8">
                    ___________________________________________________
                  </p>
                  <p className="mt-2 font-bold">
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans text-xs font-semibold cursor-default select-none border border-blue-200">
                      {"{{REPRESENTANTE_NOME}}"}
                    </span>
                  </p>
                  <p>Representante Legal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LADO DIREITO: BIBLIOTECA DE VARIÁVEIS */}
          <div className="w-80 flex flex-col gap-4">
            <Card className="shadow-sm border-zinc-200 flex-1 flex flex-col">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  Biblioteca de Variáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-auto">
                <Tabs defaultValue="edital" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="edital">Edital</TabsTrigger>
                    <TabsTrigger value="empresa">Empresa</TabsTrigger>
                  </TabsList>

                  <TabsContent value="edital" className="space-y-2">
                    <p className="text-xs text-zinc-500 mb-3">
                      Clique para inserir no texto:
                    </p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{ORGAO_NOME}}"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{EDITAL_NUMERO}}"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{VALOR_GLOBAL}}"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{VALOR_EXTENSO}}"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="empresa" className="space-y-2">
                    <p className="text-xs text-zinc-500 mb-3">
                      Clique para inserir no texto:
                    </p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{EMPRESA_RAZAO_SOCIAL}}"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{EMPRESA_CNPJ}}"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs h-8 border-dashed border-zinc-300 text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      + {"{{REPRESENTANTE_NOME}}"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
