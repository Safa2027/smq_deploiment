import { useState, useEffect } from "react";




const PRIORITIES = [
  { value: "urgente", label: "Urgente" },
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "faible", label: "Faible" },
]; 

const STATUS = [
  { value: "plan", label: "Planifié" },
  { value: "cours", label: "En cours" },
  { value: "retard", label: "En retard" },
  { value: "done", label: "Terminée" },
];
const CIRCUM = 2 * Math.PI * 46;

function noteConfig(n) {
  if (n === "C")
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };

  if (n === "PC")
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    };

  return {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  };
}

function barColor(p) {
  if (p >= 80) return "bg-emerald-500";
  if (p >= 60) return "bg-amber-400";
  return "bg-red-500";
}

function priorityStyle(p) {
  if (p === "urgente")
    return "bg-red-50 text-red-700 border-red-200";

  if (p === "haute")
    return "bg-orange-50 text-orange-700 border-orange-200";

  if (p === "moyenne")
    return "bg-blue-50 text-blue-700 border-blue-200";

  return "bg-slate-50 text-slate-600 border-slate-200";
}

function statusStyle(s) {
  if (s === "done")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (s === "cours")
    return "bg-blue-50 text-blue-700 border-blue-200";

  if (s === "retard")
    return "bg-red-50 text-red-700 border-red-200";

  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function EvaluationISO9001() {
  const [processes, setProcesses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [data, setData] = useState(null);
  const [toast, setToast] = useState(false);

  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchProcesses = async () => {
      console.log("[EvaluationISO] Fetching process list...");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/processus/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            role: localStorage.getItem("role"),
          }),
        });
        const list = await res.json();
        console.log("[EvaluationISO] Processes:", list);
        setProcesses(list.map(p => ({ id: p.id, name: p.designation })));
      } catch (err) {
        console.error("[EvaluationISO] Process list error:", err);
      }
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    if (!processes.length) return;
    const selected = processes[selectedIdx];
    if (!selected) return;

    const fetchEval = async () => {
      console.log("[EvaluationISO] Fetching evaluation for process:", selected.id);
      try {
        const [evalRes, actionsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/processus/${selected.id}/evaluation/`),
          fetch(`http://127.0.0.1:8000/api/plan-actions/?processus=${selected.id}`),
        ]);

        if (!evalRes.ok) {
          const text = await evalRes.text();
          throw new Error(`[EvaluationISO] Evaluation HTTP ${evalRes.status}: ${text.slice(0, 180)}`);
        }
        if (!actionsRes.ok) {
          const text = await actionsRes.text();
          throw new Error(`[EvaluationISO] Actions HTTP ${actionsRes.status}: ${text.slice(0, 180)}`);
        }

        const evalData = await evalRes.json();
        const actData = await actionsRes.json();
        console.log("[EvaluationISO] Eval:", evalData);
        console.log("[EvaluationISO] Actions:", actData);

        setData({
          pct: evalData.score || 0,
          status: evalData.status === "conforme" ? "Conforme" : evalData.status === "partiel" ? "Partiel" : "Non conforme",
          statusColor: evalData.score >= 70 ? "#1D9E75" : evalData.score >= 50 ? "#a05c00" : "#b91c1c",
          desc: evalData.recommendations?.join(". ") || "",
          criteria: (evalData.clauses || []).map((pct, i) => ({
            clause: ["4.1","6.1","7.1","8.1","9.1","10.2","10.3"][i] || `${i+1}`,
            label: ["Contexte","Risques","Ressources","Opérations","Indicateurs","Non-conformité","Amélioration"][i] || "",
            pct,
            note: pct >= 80 ? "C" : pct >= 60 ? "PC" : "NC",
          })),
        });

        setActions(actData.map(a => ({
          action: a.action,
          clause: a.clause || "",
          resp: a.responsable_name || "",
          delai: a.delai || "",
          prio: a.priorite || "moyenne",
          statut: a.statut || "plan",
          _id: a.id,
        })));
      } catch (err) {
        console.error("[EvaluationISO] Fetch error:", err);
      }
    };
    fetchEval();
  }, [selectedIdx, processes]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <p className="text-[#567C8E] text-sm">Chargement...</p>
    </div>
  );

  const offset = CIRCUM * (1 - data.pct / 100);

  const updateAction = (index, field, value) => {
    const updated = [...actions];
    updated[index][field] = value;
    setActions(updated);
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        action: "",
        clause: "",
        resp: "",
        delai: "",
        prio: "moyenne",
        statut: "plan",
      },
    ]);
  };

  const handleSave = async () => {
    console.log("[EvaluationISO] Saving actions:", actions);
    try {
      await Promise.all(
        actions
          .filter(a => a._id)
          .map(a =>
            fetch(`http://127.0.0.1:8000/api/plan-actions/${a._id}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                action: a.action,
                clause: a.clause,
                priorite: a.prio,
                statut: a.statut,
                delai: a.delai || null,
              }),
            })
          )
      );
      console.log("[EvaluationISO] All actions saved");
    } catch (err) {
      console.error("[EvaluationISO] Save error:", err);
    }
    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Évaluation Processus ISO 9001
          </span>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">

        {/* TOP BAR */}
        <div className="flex items-center gap-2">
          <select
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
            className="flex-1 px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-sm text-slate-700 outline-none"
          >
            {processes.map((p, i) => (
              <option key={p.id} value={i}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#2F4157] text-white text-xs font-medium hover:bg-[#243445] transition"
          >
            Enregistrer
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">

          {/* SCORE */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-5">
              Conformité globale
            </p>

            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg
                  width="112"
                  height="112"
                  viewBox="0 0 112 112"
                  className="-rotate-90"
                >
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                  />

                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    fill="none"
                    stroke={data.statusColor}
                    strokeWidth="10"
                    strokeDasharray={CIRCUM}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-slate-800">
                    {data.pct}%
                  </span>

                  <span className="text-[10px] text-slate-400">
                    conformité
                  </span>
                </div>
              </div>

              <p
                className="mt-3 text-sm font-semibold"
                style={{ color: data.statusColor }}
              >
                {data.status}
              </p>

              <p className="mt-2 text-xs text-slate-500 text-center leading-relaxed">
                {data.desc}
              </p>
            </div>
          </div>

          {/* CRITERIA */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-5">
              Critères ISO
            </p>

            <div className="flex flex-col gap-3">
              {data.criteria.map((c) => {
                const n = noteConfig(c.note);

                return (
                  <div key={c.clause} className="flex items-center gap-2">
                    <span className="w-8 text-[10px] text-slate-400 font-semibold">
                      {c.clause}
                    </span>

                    <span className="flex-1 text-xs text-slate-700 truncate">
                      {c.label}
                    </span>

                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor(c.pct)}`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-slate-500 w-8 text-right">
                      {c.pct}%
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${n.bg} ${n.text} ${n.border}`}
                    >
                      {c.note}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTION TABLE */}
          <div className="col-span-2 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Plan d'actions
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gérer les actions correctives ISO
                </p>
              </div>

              <button
                onClick={addAction}
                className="px-3 py-2 rounded-lg bg-[#EEF2F6] hover:bg-[#E2E8F0] text-[#2F4157] text-xs font-medium transition"
              >
                + Ajouter action
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">

                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    {[
                      "Action",
                      "Clause",
                      "Responsable",
                      "Délai",
                      "Priorité",
                      "Statut",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {actions.map((a, i) => (
                    <tr
                      key={i}
                      className={`border-b border-[#F1F5F9] hover:bg-[#FAFCFE] transition ${
                        a.statut === "done" ? "opacity-60" : ""
                      }`}
                    >
                      {/* ACTION */}
                      <td className="px-4 py-3 min-w-[240px]">
                        <input
                          value={a.action}
                          onChange={(e) =>
                            updateAction(i, "action", e.target.value)
                          }
                          placeholder="Nom de l'action..."
                          className={`w-full bg-transparent outline-none text-xs ${
                            a.statut === "done"
                              ? "line-through text-slate-400"
                              : "text-slate-700"
                          }`}
                        />
                      </td>

                      {/* CLAUSE */}
                      <td className="px-4 py-3 w-[90px]">
                        <input
                          value={a.clause}
                          onChange={(e) =>
                            updateAction(i, "clause", e.target.value)
                          }
                          className="w-full bg-transparent outline-none text-slate-600"
                        />
                      </td>

                      {/* RESPONSABLE */}
                      <td className="px-4 py-3 w-[150px]">
                        <input
                          value={a.resp}
                          onChange={(e) =>
                            updateAction(i, "resp", e.target.value)
                          }
                          className="w-full bg-transparent outline-none text-slate-600"
                        />
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-3 w-[150px]">
                        <input
                          type="date"
                          value={a.delai}
                          onChange={(e) =>
                            updateAction(i, "delai", e.target.value)
                          }
                          className="bg-transparent outline-none text-slate-600"
                        />
                      </td>

                      {/* PRIORITY */}
                      <td className="px-4 py-3 w-[140px]">
                        <select
                          value={a.prio}
                          onChange={(e) =>
                            updateAction(i, "prio", e.target.value)
                          }
                          className={`px-2 py-1 rounded-lg border text-[11px] font-medium outline-none ${priorityStyle(
                            a.prio
                          )}`}
                        >
                          {PRIORITIES.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3 w-[150px]">
                        <select
                          value={a.statut}
                          onChange={(e) =>
                            updateAction(i, "statut", e.target.value)
                          }
                          className={`px-2 py-1 rounded-lg border text-[11px] font-medium outline-none ${statusStyle(
                            a.statut
                          )}`}
                        >
                          {STATUS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#2F4157] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg">
          Évaluation enregistrée
        </div>
      )}
    </div>
  );
}
