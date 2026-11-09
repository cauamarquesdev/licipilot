"use client";
import { useState, useEffect } from "react";
import { Building2, Save, CreditCard, MapPin } from "lucide-react";

export default function Configuracoes() {
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [form, setForm] = useState({
    razaoSocial: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    banco: "",
    agencia: "",
    conta: "",
    pix: "",
  });

  // Carrega os dados assim que entra na tela
  useEffect(() => {
    fetch("/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setForm(data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarConfiguracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    const res = await fetch("/api/empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMensagem("✅ Configurações salvas com sucesso!");
    } else {
      setMensagem("❌ Erro ao salvar as configurações.");
    }
    setSalvando(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-zinc-200">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Building2 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Minha Empresa</h1>
          <p className="text-zinc-500 text-sm">
            Configure os dados que sairão nas suas propostas comerciais.
          </p>
        </div>
      </div>

      <form onSubmit={salvarConfiguracoes} className="space-y-8">
        {/* Bloco 1: Dados Principais */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-700 flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-zinc-400" />
            Identificação e Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Razão Social
              </label>
              <input
                required
                type="text"
                name="razaoSocial"
                value={form.razaoSocial}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                CNPJ
              </label>
              <input
                required
                type="text"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Endereço Completo
              </label>
              <input
                required
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                name="telefone"
                value={form.telefone || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Dados Bancários */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-700 flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-zinc-400" />
            Dados Bancários (Para Recebimento)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Banco
              </label>
              <input
                type="text"
                name="banco"
                value={form.banco || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Banco do Brasil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Agência
              </label>
              <input
                type="text"
                name="agencia"
                value={form.agencia || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Conta Corrente
              </label>
              <input
                type="text"
                name="conta"
                value={form.conta || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Chave PIX
              </label>
              <input
                type="text"
                name="pix"
                value={form.pix || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
          <button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {salvando ? "Salvando..." : "Salvar Configurações"}
          </button>
          {mensagem && (
            <span className="text-sm font-medium text-zinc-700">
              {mensagem}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
