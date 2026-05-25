import { useState, useEffect } from "react";

const ROLES = ["Admin", "Manager", "User"];

/* ─── ADD MODAL ─── */
function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nom et email sont obligatoires.");
      return;
    }
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm">

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-base font-semibold text-[#2F4157]">
            Nouveau utilisateur
          </span>
          <button onClick={onClose} className="text-[#567C8E] text-lg">×</button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Nom
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157]"
              placeholder="Nom utilisateur"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Email
            </label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#2F4157]"
              placeholder="email@corp.dz"
            />
          </div>

          <div>
            <label className="text-xs text-[#567C8E] font-medium mb-1 block">
              Rôle
            </label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-[#567C8E] rounded-xl text-sm bg-white text-[#1f2c3d]"
            >
              {ROLES.map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-xs mt-3">⚠ {error}</p>
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
export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("[Utilisateurs] Fetching users from backend...");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/utilisateurs/");
        const data = await res.json();
        console.log("[Utilisateurs] Raw response:", data);

        const mapped = data.map(u => ({
          id: `U-${String(u.id).padStart(3, "0")}`,
          name: `${u.prenom} ${u.nom}`,
          email: u.email,
          role: u.role,
          _backendId: u.id,
        }));
        console.log("[Utilisateurs] Mapped users:", mapped);
        setUsers(mapped);
      } catch (err) {
        console.error("[Utilisateurs] Fetch error:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    [u.name, u.email, u.role].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const addUser = async (form) => {
    console.log("[Utilisateurs] Adding user:", form);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: form.name.split(" ").slice(1).join(" ") || form.name,
          prenom: form.name.split(" ")[0],
          email: form.email,
          role: form.role.toLowerCase(),
          password: "TempPass123!",
          password2: "TempPass123!",
        }),
      });
      const data = await res.json();
      console.log("[Utilisateurs] Add response:", data);
      if (!res.ok) { alert(data.detail || "Erreur ajout"); return; }

      setUsers(prev => [...prev, {
        id: `U-${String(data.id).padStart(3, "0")}`,
        name: form.name,
        email: form.email,
        role: form.role,
        _backendId: data.id,
      }]);
      setShowAdd(false);
    } catch (err) {
      console.error("[Utilisateurs] Add error:", err);
    }
  };

  const updateRole = async (id, role) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    console.log("[Utilisateurs] Updating role:", id, "→", role);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/utilisateurs/${user._backendId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: role.toLowerCase() }),
      });
      const data = await res.json();
      console.log("[Utilisateurs] Role update response:", data);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch (err) {
      console.error("[Utilisateurs] Role update error:", err);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Liste des utilisateurs
          </span>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">

        {/* SEARCH + ADD */}
        <div className="flex gap-2 items-center flex-wrap">

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
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
                  {["ID", "Nom", "Email", "Rôle"].map(h => (
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
                {loadingUsers ? (
                  <tr><td colSpan={5} className="text-center py-10 text-[#567C8E] text-sm">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[#567C8E] text-sm">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors
                    ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                  >

                    <td className="px-4 py-3 text-[#567C8E] font-medium">
                      {u.id}
                    </td>

                    <td className="px-4 py-3 text-[#1f2c3d] font-medium">
                      {u.name}
                    </td>

                    <td className="px-4 py-3 text-[#567C8E]">
                      {u.email}
                    </td>

                    <td className="px-4 py-3">

                      <select
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value)}
                        className="border border-[#567C8E] rounded-md px-2 py-1 text-xs bg-white text-[#2F4157]"
                      >
                        {ROLES.map(r => (
                          <option key={r}>{r}</option>
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

      {/* MODAL */}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onAdd={addUser}
        />
      )}

    </div>
  );
}
