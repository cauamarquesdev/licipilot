"use client";
import { useState } from "react";

export default function ClientMarkupBox({ editalId }: { editalId: string }) {
  const [percentualMarkup, setPercentualMarkup] = useState("-10");
  const [aplicando, setAplicando] = useState(false);

  const aplicarMarkupEmMassa = async () => {
    setAplicando(true);
    const res = await fetch("/api/markup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editalId, percentual: percentualMarkup }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Erro ao aplicar markup.");
      setAplicando(false);
    }
  };

  return (
    <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div>
        <h3 className="text-sm font-bold text-blue-900">
          ⚡ Precificação em Massa (Markup)
        </h3>
        <p className="text-xs text-blue-700">
          Aplique descontos ou acréscimos automáticos em todos os itens de uma
          vez.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={percentualMarkup}
          onChange={(e) => setPercentualMarkup(e.target.value)}
          className="w-24 p-2 text-sm bg-white border border-blue-200 rounded-lg text-center font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: -10"
        />
        <span className="text-sm font-bold text-blue-900">%</span>
        <button
          onClick={aplicarMarkupEmMassa}
          disabled={aplicando}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {aplicando ? "Calculando..." : "Aplicar em Todos"}
        </button>
      </div>
    </div>
  );
}
