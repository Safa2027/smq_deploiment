import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
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

function SectionHeader({ num, title }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 border-b border-[#A2C1D1]/20"
      style={{ background: "#EEF2F6" }}
    >
      <span className="text-[10px] text-[#2F4157]">{num}</span>
      <span className="text-[12px] font-medium text-[#2F4157]">
        {title}
      </span>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white border border-[#A2C1D1]/30 rounded-xl overflow-hidden shadow-sm">
      {children}
    </div>
  );
}

function RowField({ label, children }) {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#A2C1D1]/20 last:border-b-0">
      <div className="text-[11px] text-[#567C8E] min-w-[140px]">
        {label}
      </div>
      <div className="flex-1 text-[12px] text-[#1f2c3d]">
        {children}
      </div>
    </div>
  );
}

export default function AuditDetail() {
  const { state: auditData } = useLocation();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(
    auditData || {
      titre: "",
      id: "",
      processus: "",
      clause: "",
      auditeur: "",
      statut: "Planifié",
      objectif: "",
      perimetre: "",
      contexte: "",
      conclusion: "",
      constats: [],
      documents: [],
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(false);

  const updateField = (key, value) => {
    setAudit((prev) => ({ ...prev, [key]: value }));
  };

  const updateConstat = (index, key, value) => {
    const updated = [...audit.constats];
    updated[index] = { ...updated[index], [key]: value };
    setAudit({ ...audit, constats: updated });
  };

  const addConstat = () => {
    setAudit({
      ...audit,
      constats: [
        ...audit.constats,
        {
          id: Date.now(),
          type: "",
          clause: "",
          description: "",
          file: null,
        },
      ],
    });
  };

  const removeConstat = (index) => {
    setAudit({
      ...audit,
      constats: audit.constats.filter((_, i) => i !== index),
    });
  };

  const uploadConstatFile = (index, file) => {
    const updated = [...audit.constats];
    updated[index].file = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };
    setAudit({ ...audit, constats: updated });
  };

  const uploadDocument = (file) => {
    const newDoc = {
      id: Date.now(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };

    setAudit((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc],
    }));
  };

  const removeDocument = (id) => {
    setAudit((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (

    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
        <button onClick={() => navigate(-1)} className="text-[#2F4157]">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-medium text-[#2F4157]">Plan d'audit</span>
      </div>
    </header>

      <div className="p-6 flex flex-col gap-5">

        {/* HERO */}
        <div
          className="rounded-2xl p-7 text-white shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, #2F4157 0%, #567C8E 55%, #A2C1D1 100%)",
          }}
        >
          {isEditing ? (
            <div className="space-y-3">
              <input
                value={audit.titre}
                onChange={(e) => updateField("titre", e.target.value)}
                className="w-full bg-transparent border-b border-white/30 text-3xl font-semibold outline-none pb-2"
              />
              <input
                value={audit.id}
                onChange={(e) => updateField("id", e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-sm outline-none pb-1"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-semibold">{audit.titre}</h1>
              <p className="text-sm opacity-80 mt-2">
                {audit.id} • {audit.clause}
              </p>
            </>
          )}

          {/* ACTIONS RIGHT ALIGNED */}
          <div className="flex justify-end gap-2 mt-6">

            {/* Exporter only in read mode */}
            {!isEditing && (
              <button className="px-4 py-2 rounded-lg bg-white/15 border border-white/20 text-white text-xs hover:bg-white/20">
                Exporter
              </button>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg bg-white text-[#2F4157] text-xs font-medium hover:bg-[#EEF2F6]"
            >
              {isEditing ? "Annuler" : "Modifier"}
            </button>

            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-[#1f2c3d] text-white text-xs hover:bg-black"
              >
                Enregistrer
              </button>
            )}

          </div>
        </div>

        {/* GENERAL */}
        <div className="flex flex-col gap-4">

          <Card>
            <SectionHeader num="01" title="Informations générales" />

            <RowField label="Processus">
              {isEditing ? (
                <input
                  value={audit.processus || ""}
                  onChange={(e) => updateField("processus", e.target.value)}
                  className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px]"
                />
              ) : (
                audit.processus
              )}
            </RowField>

            <RowField label="Clause">
              {isEditing ? (
                <input
                  value={audit.clause || ""}
                  onChange={(e) => updateField("clause", e.target.value)}
                  className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px]"
                />
              ) : (
                audit.clause
              )}
            </RowField>

            <RowField label="Auditeur">
              {isEditing ? (
                <input
                  value={audit.auditeur || ""}
                  onChange={(e) => updateField("auditeur", e.target.value)}
                  className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px]"
                />
              ) : (
                audit.auditeur
              )}
            </RowField>

            <RowField label="Statut">
              {isEditing ? (
                <select
                  value={audit.statut}
                  onChange={(e) => updateField("statut", e.target.value)}
                  className="border border-[#567C8E] rounded-lg px-3 py-2 text-[12px] bg-white"
                >
                  {STATUTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium
                  ${STATUT_STYLE[audit.statut]?.bg}
                  ${STATUT_STYLE[audit.statut]?.text}`}
                >
                  {audit.statut}
                </span>
              )}
            </RowField>
          </Card>
      
       {/* OBJECTIF */}
          <Card>
            <SectionHeader
              num="02"
              title="Objectif et périmètre"
            />

            <RowField label="Objectif">
              {isEditing ? (
                <textarea
                  value={audit.objectif || ""}
                  onChange={(e) =>
                    updateField("objectif", e.target.value)
                  }
                  className="w-full border border-[#567C8E]
                  rounded-lg px-3 py-2 min-h-[90px] text-[12px]"
                />
              ) : (
                audit.objectif || "—"
              )}
            </RowField>

            <RowField label="Périmètre">
              {isEditing ? (
                <textarea
                  value={audit.perimetre || ""}
                  onChange={(e) =>
                    updateField("perimetre", e.target.value)
                  }
                  className="w-full border border-[#567C8E]
                  rounded-lg px-3 py-2 min-h-[90px] text-[12px]"
                />
              ) : (
                audit.perimetre || "—"
              )}
            </RowField>

          </Card>

          {/* CONTEXTE */}
          <Card>
            <SectionHeader
              num="03"
              title="Contexte et conclusion"
            />

            <RowField label="Contexte">
              {isEditing ? (
                <textarea
                  value={audit.contexte || ""}
                  onChange={(e) =>
                    updateField("contexte", e.target.value)
                  }
                  className="w-full border border-[#567C8E]
                  rounded-lg px-3 py-2 min-h-[100px] text-[12px]"
                />
              ) : (
                audit.contexte || "—"
              )}
            </RowField>

            <RowField label="Conclusion">
              {isEditing ? (
                <textarea
                  value={audit.conclusion || ""}
                  onChange={(e) =>
                    updateField("conclusion", e.target.value)
                  }
                  className="w-full border border-[#567C8E]
                  rounded-lg px-3 py-2 min-h-[100px] text-[12px]"
                />
              ) : (
                audit.conclusion || "—"
              )}
            </RowField>

          </Card>
{/* CONSTATS */}
<Card>
  <SectionHeader num="04" title="Constats" />

  <div className="p-4 flex flex-col gap-4">

    {/* ADD BUTTON (EDIT MODE) */}
    {isEditing && (
      <label className="cursor-pointer inline-flex w-fit px-4 py-2 rounded-lg bg-[#2F4157] text-white text-[12px] hover:bg-[#1f2c3d]">
        + Importer constat
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              uploadConstatFile(audit.constats.length, e.target.files[0]);
            }
          }}
        />
      </label>
    )}

    {/* LIST */}
    {(audit.constats || []).length === 0 ? (
      <p className="text-[12px] text-[#567C8E]">
        Aucun constat ajouté.
      </p>
    ) : (
      audit.constats.map((c, index) => (
        <div
          key={c.id}
          className="border border-[#A2C1D1]/30 rounded-lg p-4 bg-white flex flex-col gap-3"
        >
          {/* TYPE */}
          <div>
            <div className="text-[11px] text-[#567C8E] mb-1">Type</div>
            {isEditing ? (
              <input
                value={c.type || ""}
                onChange={(e) =>
                  updateConstat(index, "type", e.target.value)
                }
                className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px]"
              />
            ) : (
              <div className="text-[12px] text-[#1f2c3d]">{c.type || "—"}</div>
            )}
          </div>

          {/* CLAUSE */}
          <div>
            <div className="text-[11px] text-[#567C8E] mb-1">Clause</div>
            {isEditing ? (
              <input
                value={c.clause || ""}
                onChange={(e) =>
                  updateConstat(index, "clause", e.target.value)
                }
                className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px]"
              />
            ) : (
              <div className="text-[12px] text-[#1f2c3d]">{c.clause || "—"}</div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="text-[11px] text-[#567C8E] mb-1">Description</div>
            {isEditing ? (
              <textarea
                value={c.description || ""}
                onChange={(e) =>
                  updateConstat(index, "description", e.target.value)
                }
                className="w-full border border-[#567C8E] rounded-lg px-3 py-2 text-[12px] min-h-[80px]"
              />
            ) : (
              <div className="text-[12px] text-[#1f2c3d]">
                {c.description || "—"}
              </div>
            )}
          </div>

          {/* FILE */}
          <div>
            <div className="text-[11px] text-[#567C8E] mb-1">Fichier</div>

            {c.file ? (
              <a
                href={c.file.url}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-[#2F4157] underline"
              >
                {c.file.name}
              </a>
            ) : (
              <span className="text-[12px] text-[#567C8E]">Aucun fichier</span>
            )}

            {isEditing && (
              <div className="mt-2">
                <label className="cursor-pointer text-[12px] text-[#2F4157] underline">
                  Modifier fichier
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        uploadConstatFile(index, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* DELETE */}
          {isEditing && (
            <button
              onClick={() => removeConstat(index)}
              className="text-red-500 text-[11px] self-end"
            >
              Supprimer
            </button>
          )}
        </div>
      ))
    )}
  </div>
</Card>

          {/* DOCUMENTS */}
          <Card>
            <SectionHeader num="05" title="Documents associés" />

            <div className="p-4">

              {/* ONLY IN EDIT MODE */}
              {isEditing && (
                <div className="border border-dashed border-[#567C8E]/40 rounded-xl p-6 bg-[#FAFCFE]">

                  <label className="cursor-pointer inline-flex px-4 py-2 rounded-lg bg-[#2F4157] text-white text-[12px] hover:bg-[#1f2c3d]">
                    + Importer document
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => uploadDocument(e.target.files[0])}
                    />
                  </label>

                </div>
              )}

              <div className="mt-5 flex flex-col gap-3">

                {(audit.documents || []).length === 0 ? (
                  <p className="text-[12px] text-[#567C8E]">Aucun document importé.</p>
                ) : (
                  audit.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between border border-[#A2C1D1]/30 rounded-lg px-4 py-3 bg-white"
                    >
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] text-[#2F4157] underline"
                      >
                        {doc.name}
                      </a>

                      {isEditing && (
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 text-[11px]"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))
                )}

              </div>

            </div>
          </Card>

        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-[#E1F5EE] border border-[#2F4157] text-[#2F4157] text-[12px] px-4 py-2.5 rounded-lg shadow-lg z-50">
            ✓ Audit enregistré
          </div>
        )}

      </div>
    </div>
  );
}       
       
 