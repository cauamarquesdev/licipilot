import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CofreCertidoes() {
  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden font-sans">
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between border-r border-zinc-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-zinc-50 mb-8 tracking-tight">
            Licita<span className="text-blue-500">Pro</span>
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
                className="w-full justify-start text-zinc-50 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
              >
                Cofre de Certidões
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        {/* Cabeçalho */}
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
              Cofre de Certidões
            </h2>
            <p className="text-zinc-500 mt-1">
              Controle de validade e repositório central de habilitação.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            + Nova Certidão / Atualizar
          </Button>
        </header>

        {/* MÉTRICAS DE SAÚDE DA EMPRESA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Válidas
              </p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Vencem em &lt; 15 dias
              </p>
              <p className="text-3xl font-bold text-amber-600">1</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-1">
                Vencidas (Bloqueadas)
              </p>
              <p className="text-3xl font-bold text-red-600">0</p>
            </CardContent>
          </Card>
        </div>

        {/* TABELA DE CERTIDÕES */}
        <Card className="flex-1 shadow-sm border-zinc-200 overflow-hidden flex flex-col">
          <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
            <CardTitle className="text-lg text-zinc-800">
              Documentos Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-zinc-50 sticky top-0">
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Órgão Emissor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Linha 1 - Vencendo */}
                <TableRow className="bg-amber-50/30">
                  <TableCell className="font-medium">
                    Certificado de Regularidade (CRF)
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    Caixa Econômica Federal (FGTS)
                  </TableCell>
                  <TableCell className="text-amber-700 font-semibold">
                    04/09/2026
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-700 bg-amber-50"
                    >
                      Vence em 2 dias
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-300"
                    >
                      Substituir Arquivo
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Linha 2 - Válida */}
                <TableRow>
                  <TableCell className="font-medium">
                    Certidão Negativa de Débitos (CND)
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    Receita Federal do Brasil
                  </TableCell>
                  <TableCell>15/12/2026</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-700 bg-green-50"
                    >
                      Válida
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Arquivo
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Linha 3 - Válida */}
                <TableRow>
                  <TableCell className="font-medium">
                    Certidão Negativa Trabalhista (CNDT)
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    Tribunal Superior do Trabalho
                  </TableCell>
                  <TableCell>20/11/2026</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-700 bg-green-50"
                    >
                      Válida
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Arquivo
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
