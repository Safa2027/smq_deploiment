import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../api.js'


const STATUTS = ["Planifié", "En cours", "Clôturé"];

const STATUT_STYLE = {
  "Clôturé": {
    bg: "bg-[#E1F5EE]",
    text: "text-[#2F4157]",
  },
  "En cours": {
    bg: "bg-[#FAEEDA]",
    text: "text-[#2F4157]",
  },
  "Planifié": {
    bg: "bg-[#A2C1D1]/40",
    text: "text-[#2F4157]",
  },
};

function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

/* ─── ADD MODAL ─── */
function AddAuditModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    titre: "",
    processus: "",
    clause: "",
    dateDebut: "",
    dateFin: "",
    statut: "Planifié",
    score: "",
    auditeur: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (
      !form.titre.trim() ||
      !form.processus.trim() ||
      !form.dateDebut ||
      !form.dateFin
    ) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl mx-4 p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-base font-semibold text-[#2F4157]">
            Nouvel audit
          </span>

          <button
            onClick={onClose}
            className="text-[#567C8E] text-lg cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Titre
            </label>

            <input
              value={form.titre}
              onChange={(e) =>
                setForm({ ...form, titre: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157]"
              placeholder="Titre audit"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Processus
            </label>

            <input
              value={form.processus}
              onChange={(e) =>
                setForm({ ...form, processus: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157]"
              placeholder="Nom processus"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Clause
            </label>

            <input
              value={form.clause}
              onChange={(e) =>
                setForm({ ...form, clause: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157]"
              placeholder="7.1 / 7.2"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Date début
            </label>

            <input
              type="date"
              value={form.dateDebut}
              onChange={(e) =>
                setForm({ ...form, dateDebut: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d]"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Date fin
            </label>

            <input
              type="date"
              value={form.dateFin}
              onChange={(e) =>
                setForm({ ...form, dateFin: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d]"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Score
            </label>

            <input
              type="number"
              value={form.score}
              onChange={(e) =>
                setForm({ ...form, score: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d]"
              placeholder="85"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Auditeur
            </label>

            <input
              value={form.auditeur}
              onChange={(e) =>
                setForm({ ...form, auditeur: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d]"
              placeholder="Nom auditeur"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Statut
            </label>

            <select
              value={form.statut}
              onChange={(e) =>
                setForm({ ...form, statut: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm bg-white text-[#1f2c3d]"
            >
              {STATUTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-xs mt-3">
            ⚠ {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#567C8E] text-xs text-[#567C8E] cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-[#2F4157] text-white text-xs font-medium cursor-pointer"
          >
            Ajouter
          </button>

        </div>

      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AuditList() {
  const navigate = useNavigate();

  const [audits, setAudits] = useState([]);
  const [loadingAudits, setLoadingAudits] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const fetchAudits = async () => {
      console.log("[AuditList] Fetching audits from backend...");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/audits/");
        const data = await res.json();
        console.log("[AuditList] Raw response:", data);

        const mapped = data.map(a => ({
          id: a.id,
          titre: a.titre || "",
          processus: a.processus_name || "",
          clause: a.clause || "",
          dateDebut: a.date_debut || "",
          dateFin: a.date_fin || "",
          statut: a.etat_audit === "planifie" ? "Planifié"
                 : a.etat_audit === "en_cours" ? "En cours"
                 : a.etat_audit === "cloture" ? "Clôturé"
                 : a.etat_audit,
          score: a.score || 0,
          auditeur: a.auditeur_name || "",
        }));

        console.log("[AuditList] Mapped audits:", mapped);
        setAudits(mapped);
      } catch (err) {
        console.error("[AuditList] Fetch error:", err);
      } finally {
        setLoadingAudits(false);
      }
    };
    fetchAudits();
  }, []);

  const filtered = audits.filter((a) =>
    [
      a.id,
      a.titre,
      a.processus,
      a.statut,
      a.auditeur,
    ].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const addAudit = async (form) => {
    console.log("[AuditList] Adding audit:", form);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/audits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titre: form.titre,
          clause: form.clause,
          date_audit: form.dateDebut,
          date_debut: form.dateDebut,
          date_fin: form.dateFin,
          score: Number(form.score || 0),
          etat_audit: form.statut === "Planifié" ? "planifie"
                    : form.statut === "En cours" ? "en_cours"
                    : "cloture",
        }),
      });
      const data = await res.json();
      console.log("[AuditList] Add response:", data);
      if (!res.ok) { alert(data.detail || "Erreur ajout"); return; }

      setAudits(prev => [...prev, {
        id: data.id,
        titre: form.titre,
        processus: form.processus,
        clause: form.clause,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        statut: form.statut,
        score: Number(form.score || 0),
        auditeur: form.auditeur,
      }]);
      setShowAdd(false);
    } catch (err) {
      console.error("[AuditList] Add error:", err);
    }
  };

  const updateStatut = async (id, statut) => {
    console.log("[AuditList] Updating statut:", id, "→", statut);
    const etat = statut === "Planifié" ? "planifie"
               : statut === "En cours" ? "en_cours"
               : "cloture";
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/audits/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etat_audit: etat }),
      });
      console.log("[AuditList] Statut update status:", res.status);
      setAudits(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
    } catch (err) {
      console.error("[AuditList] Statut update error:", err);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Liste des audits
          </span>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">

        {/* SEARCH + ADD */}
        <div className="flex gap-2 items-center flex-wrap">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un audit..."
            className="flex-1 min-w-[220px] px-3 py-2 bg-white border border-[#567C8E] rounded-lg text-[13px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1]"
          />

          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-[#2F4157] text-white rounded-lg text-xs font-medium hover:bg-[#1f2c3d] cursor-pointer"
          >
            + Ajouter
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">

            <table className="w-full border-collapse text-sm">

              <thead>
                <tr className="bg-[#f0f4f7] sticky top-0 z-10">
                  {[
                    "ID",
                    "Titre",
                    "Processus",
                    "Période",
                    "Score",
                    "Statut",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[#567C8E] font-medium text-xs border-b border-slate-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loadingAudits ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-[#567C8E] text-sm"
                    >
                      Chargement...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-[#567C8E] text-sm"
                    >
                      Aucun audit trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((audit, i) => {
                    const st = STATUT_STYLE[audit.statut];

                    return (
                      <tr
                        key={audit.id}
                        onClick={() =>
                          navigate(`/audits/${audit.id}`, {
                            state: audit,
                          })
                        }
                        className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer
                        ${
                          i % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/60"
                        }`}
                      >

                        <td className="px-4 py-3 text-[#567C8E] font-medium">
                          {audit.id}
                        </td>

                        <td className="px-4 py-3 text-[#1f2c3d] font-medium">
                          {audit.titre}
                        </td>

                        <td className="px-4 py-3 text-[#567C8E]">
                          {audit.processus}
                        </td>

                        <td className="px-4 py-3 text-[#567C8E] text-sm">
                          {fmtDate(audit.dateDebut)} →{" "}
                          {fmtDate(audit.dateFin)}
                        </td>

                        <td className="px-4 py-3 text-[#2F4157] font-semibold">
                          {audit.score}
                        </td>

                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={audit.statut}
                            onChange={(e) =>
                              updateStatut(
                                audit.id,
                                e.target.value
                              )
                            }
                            className={`border rounded-md px-2 py-1 text-xs bg-white
                            ${st?.bg} ${st?.text} border-[#567C8E]`}
                          >
                            {STATUTS.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showAdd && (
        <AddAuditModal
          onClose={() => setShowAdd(false)}
          onAdd={addAudit}
        />
      )}

    </div>
  );
}
