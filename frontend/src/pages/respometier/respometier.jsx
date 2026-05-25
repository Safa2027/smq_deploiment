import { useState, useEffect } from "react";

const TYPE_COLORS = {
  RH:         { bg: "#E1F5EE", color: "#0F6E56", border: "#5DCAA5" },
  Finance:    { bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27" },
  Qualité:    { bg: "#E6F1FB", color: "#185FA5", border: "#85B7EB" },
  Logistique: { bg: "#EEEDFE", color: "#534AB7", border: "#AFA9EC" },
  Technique:  { bg: "#FCEBEB", color: "#A32D2D", border: "#F09595" },
  Juridique:  { bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
};


function Avatar({ name }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#A2C1D1] text-[#1f2c3d] flex items-center justify-center text-xs font-medium flex-shrink-0">
      {initials}
    </div>
  );
}

function TypeBadge({ type }) {
  const s = TYPE_COLORS[type] || { bg: "#f0f0f0", color: "#555", border: "#ccc" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap">
      {type}
    </span>
  );
}

function NotifyBtn() {
  const [sent, setSent] = useState(false);
  return (
    <button
      onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }}
      className={`px-3 py-1 rounded-md text-xs font-medium border transition-all whitespace-nowrap cursor-pointer
        ${sent ? "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]" : "bg-white text-[#2F4157] border-[#567C8E] hover:bg-gray-50"}`}
    >
      {sent ? "Envoyé" : "Notifier"}
    </button>
  );
}

/* ─── MODAL CENTRÉ : Changer responsable ─── */
function ResponsableModal({ process, allResponsables, onClose, onSave }) {
  const [selected, setSelected] = useState(process.responsable);
  const preview = allResponsables.find(r => r.name === selected);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
          
            <span className="text-sm font-semibold text-[#2F4157]">Changer le responsable</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f8f8f8] text-[#567C8E] hover:text-[#2F4157] cursor-pointer text-lg">×</button>
        </div>

        {/* Process name pill */}
        <div className="bg-[#f0f4f7] rounded-lg px-3 py-2 mb-4">
          <p className="text-xs text-[#567C8E]">Processus</p>
          <p className="text-sm font-medium text-[#2F4157]">{process.nom}</p>
        </div>

        {/* Select */}
        <label className="text-xs text-[#567C8E] mb-1.5 block font-medium">Sélectionner un responsable</label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full border border-[#567C8E] rounded-xl px-3 py-2.5 text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157] bg-white mb-4"
        >
          {allResponsables.map(r => (
            <option key={r.name} value={r.name}>{r.name}</option>
          ))}
        </select>

    

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#567C8E] text-xs text-[#567C8E] hover:bg-slate-50 cursor-pointer font-medium">
            Annuler
          </button>
          <button
            onClick={() => onSave(process.id, selected, preview?.email || process.email)}
            className="px-4 py-2 rounded-xl bg-[#2F4157] text-white text-xs font-semibold hover:bg-[#1f2c3d] cursor-pointer">
             Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL CENTRÉ : Ajouter processus ─── */
function AddModal({ allResponsables, typeColors, onClose, onAdd }) {
  const [form, setForm] = useState({
   
    nom: "",
    type: "RH",
    responsable: allResponsables[0]?.name || "",
    email: allResponsables[0]?.email || "",
  });
  const [formError, setFormError] = useState("");

  const handleResponsableChange = (name) => {
    const found = allResponsables.find(r => r.name === name);
    setForm(f => ({ ...f, responsable: name, email: found?.email || "" }));
  };

  const handleSubmit = () => {
    if (!form.nom.trim()) {
      setFormError("Le nom du processus est obligatoire.");
      return;
    }
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#2F4157]">Nouveau processus</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#567C8E] cursor-pointer text-lg">×</button>
        </div>

        <div className="flex flex-col gap-4">
         

          {/* Nom */}
          <div>
            <label className="text-xs text-[#567C8E] mb-1 block font-medium">Nom du processus <span className="text-red-400">*</span></label>
            <input
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              placeholder="ex: Gestion des risques"
              className="w-full px-3 py-2 text-sm border border-[#567C8E] rounded-xl text-[#1f2c3d] outline-none focus:ring-2 focus:ring-[#2F4157]"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs text-[#567C8E] mb-1 block font-medium">Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-[#567C8E] rounded-xl text-[#1f2c3d] outline-none focus:ring-2 focus:ring-[#2F4157] bg-white"
            >
              {Object.keys(typeColors).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Responsable dropdown */}
          <div>
            <label className="text-xs text-[#567C8E] mb-1 block font-medium">Responsable</label>
            <select
              value={form.responsable}
              onChange={e => handleResponsableChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#567C8E] rounded-xl text-[#1f2c3d] outline-none focus:ring-2 focus:ring-[#2F4157] bg-white"
            >
              {allResponsables.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

         
        </div>

        {formError && (
          <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
            <span>⚠</span> {formError}
          </p>
        )}

        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 border border-[#567C8E] rounded-xl text-xs text-[#567C8E] hover:bg-slate-50 cursor-pointer font-medium">
            Annuler
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2 bg-[#2F4157] text-white rounded-xl text-xs font-semibold hover:bg-[#1f2c3d] cursor-pointer">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function ResponsableProcessus() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState([]);
  const [allResponsables, setAllResponsables] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [popupProcess, setPopupProcess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("[ResponsableProcessus] Fetching processus and users...");
      try {
        const resProc = await fetch("http://127.0.0.1:8000/api/processus/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            role: localStorage.getItem("role"),
          }),
        });
        const procData = await resProc.json();
        console.log("[ResponsableProcessus] Processus:", procData);

        const resUsers = await fetch("http://127.0.0.1:8000/api/utilisateurs/");
        const usersData = await resUsers.json();
        console.log("[ResponsableProcessus] Users:", usersData);

        const mapped = procData.map(p => ({
          id: `P-${String(p.id).padStart(3, "0")}`,
          _backendId: p.id,
          nom: p.designation,
          type: p.type_processus || "Support",
          responsable: p.pilote_detail?.full_name || "—",
          email: p.pilote_detail?.email || "",
        }));
        setData(mapped);

        const mappedUsers = usersData.map(u => ({
          name: `${u.prenom} ${u.nom}`,
          email: u.email,
          _backendId: u.id,
        }));
        setAllResponsables(mappedUsers);

      } catch (err) {
        console.error("[ResponsableProcessus] Fetch error:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter(p =>
    [p.id, p.nom, p.type, p.responsable, p.email].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

 const handleAdd = async (form) => {
  const user = allResponsables.find(r => r.name === form.responsable);
  console.log("[ResponsableProcessus] Adding process:", form);
  try {
    const res = await fetch("http://127.0.0.1:8000/api/processus/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        designation: form.nom,
        type_processus: form.type,
        pilote: user?._backendId,
      }),
    });
    const data_res = await res.json();
    console.log("[ResponsableProcessus] Add response:", data_res);
    if (!res.ok) { alert(data_res.error || "Erreur création"); return; }

    setData(prev => [...prev, {
      id: `P-${String(data_res.id).padStart(3, "0")}`,
      _backendId: data_res.id,
      nom: form.nom,
      type: form.type,
      responsable: form.responsable,
      email: user?.email || "",
    }]);
    setShowAddModal(false);
  } catch (err) {
    console.error("[ResponsableProcessus] Add error:", err);
  }
};

  const handleSaveResponsable = async (processId, newName, newEmail) => {
    const proc = data.find(p => p.id === processId);
    const user = allResponsables.find(r => r.name === newName);
    console.log("[ResponsableProcessus] Saving new responsable:", newName, "for process:", processId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/processus/${proc._backendId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pilote: user?._backendId }),
      });
      console.log("[ResponsableProcessus] PATCH status:", res.status);
    } catch (err) {
      console.error("[ResponsableProcessus] PATCH error:", err);
    }
    setData(prev => prev.map(p =>
      p.id === processId ? { ...p, responsable: newName, email: newEmail } : p
    ));
    setPopupProcess(null);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">Responsables processus</span>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">
        {/* SEARCH + ADD */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un processus, responsable..."
              className="flex-1 min-w-[220px] px-3 py-2 bg-white border border-[#567C8E] rounded-lg text-[13px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1]"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2F4157] text-white rounded-lg text-xs font-medium hover:bg-[#1f2c3d] transition-colors whitespace-nowrap cursor-pointer"
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
                  {["ID", "Nom du processus", "Type", "Responsable", "Email", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[#567C8E] font-medium text-xs border-b border-slate-200 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#567C8E] text-sm">
                      Chargement...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#567C8E] text-sm">
                      Aucun résultat trouvé.
                    </td>
                  </tr>
                ) : filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                  >
                    <td className="px-4 py-3 text-[#567C8E] font-medium whitespace-nowrap">{p.id}</td>
                    <td className="px-4 py-3 text-[#1f2c3d] font-medium">{p.nom}</td>
                    <td className="px-4 py-3"><TypeBadge type={p.type} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPopupProcess(p)}
                        className="flex items-center gap-2 group cursor-pointer hover:bg-[#f0f6fa] rounded-lg px-2 py-1 -mx-2 transition-colors"
                        title="Cliquer pour changer le responsable"
                      >
                        <Avatar name={p.responsable} />
                        <span className="text-[#2F4157] group-hover:underline underline-offset-2">
                          {p.responsable}
                        </span>
                        <svg className="w-3 h-3 text-[#567C8E] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15H9v-2z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        
                        <span className="text-[#567C8E] text-xs">{p.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <NotifyBtn email={p.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>

      {/* MODAL: Changer responsable */}
      {popupProcess && (
        <ResponsableModal
          process={popupProcess}
          allResponsables={allResponsables}
          onClose={() => setPopupProcess(null)}
          onSave={handleSaveResponsable}
        />
      )}

      {/* MODAL: Ajouter processus */}
      {showAddModal && (
        <AddModal
          allResponsables={allResponsables}
          typeColors={TYPE_COLORS}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
