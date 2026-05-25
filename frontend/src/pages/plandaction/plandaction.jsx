import { useState, useMemo, useEffect } from "react";

function uniq(arr, key) {
  return [...new Set(arr.map(a => a[key]))].sort();
}


function priorityStyle(p) {
  if (p === "Urgente")
    return "bg-red-50 text-red-700 border-red-200";
  if (p === "Haute")
    return "bg-orange-50 text-orange-700 border-orange-200";
  if (p === "Moyenne")
    return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function statusStyle(s) {
  if (s === "En retard")
    return "bg-red-50 text-red-700 border-red-200";
  if (s === "En cours")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "Planifié")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function PlanDAction() {
  const [data, setData] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [search, setSearch] = useState("");
  const [fProc, setFProc] = useState("");
  const [fPrio, setFPrio] = useState("");
  const [fStat, setFStat] = useState("");
  const [fResp, setFResp] = useState("");

  useEffect(() => {
    const fetchActions = async () => {
      console.log("[PlanDAction] Fetching plan actions...");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/plan-actions/");
        const raw = await res.json();
        console.log("[PlanDAction] Raw response:", raw);

        const mapped = raw.map(a => ({
          id: a.id,
          processus: a.processus_name || "",
          action: a.action || "",
          clause: a.clause || "",
          responsable: a.responsable_name || "",
          delai: a.delai
                   ? new Date(a.delai).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
                   : "—",
          priorite: a.priorite === "urgente" ? "Urgente"
                 : a.priorite === "haute" ? "Haute"
                 : a.priorite === "moyenne" ? "Moyenne"
                 : a.priorite || "Faible",
          statut: a.statut === "en_cours" ? "En cours"
               : a.statut === "en_retard" ? "En retard"
               : a.statut === "termine" ? "Terminé"
               : "Planifié",
        }));

        console.log("[PlanDAction] Mapped actions:", mapped);
        setData(mapped);
      } catch (err) {
        console.error("[PlanDAction] Fetch error:", err);
      } finally {
        setLoadingActions(false);
      }
    };
    fetchActions();
  }, []);

  const hasFilter = search || fProc || fPrio || fStat || fResp;

  const reset = () => {
    setSearch("");
    setFProc("");
    setFPrio("");
    setFStat("");
    setFResp("");
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(r =>
      (!q || r.action.toLowerCase().includes(q) || r.processus.toLowerCase().includes(q)) &&
      (!fProc || r.processus === fProc) &&
      (!fPrio || r.priorite === fPrio) &&
      (!fStat || r.statut === fStat) &&
      (!fResp || r.responsable === fResp)
    );
  }, [data, search, fProc, fPrio, fStat, fResp]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">Plans d'actions</span>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">
        {/* RECHERCHE + FILTRES */}
        <div className="flex gap-2 items-center flex-wrap">

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une action…"
           className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-[#567C8E] rounded-lg text-[13px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1]"
          
          />

          {[
            { value: fProc, set: setFProc, options: uniq(data, "processus"), placeholder: "Processus" },
            { value: fPrio, set: setFPrio, options: uniq(data, "priorite"), placeholder: "Priorité" },
            { value: fStat, set: setFStat, options: uniq(data, "statut"), placeholder: "Statut" },
            { value: fResp, set: setFResp, options: uniq(data, "responsable"), placeholder: "Responsable" },
          ].map(({ value, set, options, placeholder }) => (
            <select
              key={placeholder}
              value={value}
              onChange={e => set(e.target.value)}
              className="px-3 py-2 text-[12px] font-medium rounded-lg transition-colors border text-[#567C8E]"
            >
              <option value="">{placeholder}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          {hasFilter && (
            <button onClick={reset} className="text-[12px] text-slate-500 hover:text-red-500 underline">
              Réinitialiser
            </button>
          )} 
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">

            <table className="w-full border-collapse text-sm">

              <thead>
                <tr className="bg-[#f0f4f7] sticky top-0 z-10">
                {["Processus", "Action", "Clause", "Responsable", "Délai", "Priorité", "Statut"].map(h => (
                  <th key={h}   className="px-4 py-3 text-left text-[#567C8E] font-medium text-xs border-b border-slate-200"
                    >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loadingActions ? (
                <tr><td colSpan={7} className="text-center py-10 text-[#567C8E] text-sm">Chargement...</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">

                  <td className="px-3 py-2">
                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px]">
                      {a.processus}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-slate-700">{a.action}</td>
                  <td className="px-3 py-2 text-slate-500">{a.clause}</td>
                  <td className="px-3 py-2 font-medium text-slate-700">{a.responsable}</td>
                  <td className="px-3 py-2 text-slate-500">{a.delai}</td>

                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-md border ${priorityStyle(a.priorite)}`}>
                      {a.priorite}
                    </span>
                  </td>

                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-md border ${statusStyle(a.statut)}`}>
                      {a.statut}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
        </div>
      </div>
    </div>
    
  );
}
