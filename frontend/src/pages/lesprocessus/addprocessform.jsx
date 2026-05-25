import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const STEPS = [
  "Informations générales",
  "Éléments clés",
  "Contexte",
  "KPIs",
  "BPMN",
];

export default function AddProcessForm({ onBack, onSave }) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    pilote: "Aya",
    desig: "",
    objectif: "",
    structures: "RH",
    type: "Management",
    delai: "",
    cout: "",
    entrees: "",
    sorties: "",
    clients: "",
    effectifs: "",
    competences: "",
    voisins: "",
    enjeux: "",
    moyens: "",
    contraintes: "",
    risques: "",
    kpis: [{ label: "", cible: "", frequence: "Semestriel" }],
    bpmnFile: null,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKpiChange = (index, field, value) => {
    const updated = [...form.kpis];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, kpis: updated }));
  };

  const addKpi = () => {
    setForm((prev) => ({
      ...prev,
      kpis: [...prev.kpis, { label: "", cible: "", frequence: "Semestriel" }],
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, bpmnFile: file.name }));
  };

  const nextStep = () => { if (step < STEPS.length - 1) setStep(step + 1); };
  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = () => {
    const newProcess = { ...form, id: Date.now() };
    onSave(newProcess);
  };

  const inputClass =
    "w-full px-2 py-1.5 bg-white border border-[#567C8E] rounded-md text-[12px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1]";

  const label = (text) => (
    <label className="text-[11px] font-medium text-[#2F4157]">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  return (
  
              <div className="bg-[#F8FAFC] min-h-screen">
          <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
            <div className="h-14 flex items-center px-6">
              <button onClick={onBack} className="text-[#2F4157]">
      <ChevronLeft size={20} />
    </button>
              <span className="text-lg font-medium text-[#2F4157]">Nouveau processus</span>
            </div>
          </header>

      <div
        className="max-w-2xl mx-auto p-3 flex flex-col gap-3"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >

        {/* STEPS */}
        <div className="flex gap-1 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={i}
              className={`px-3 py-2 text-[12px] font-medium rounded-[18px] border ${
                i === step ? "bg-[#2F4157] text-white border-[#2F4157]" : "bg-white text-[#567C8E] border-[#567C8E]"
              }`}>
              {s}
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 space-y-3 flex-1">

          {/* STEP 1 */}
          {step === 0 && (
            <>
              <div>{label("Nom du processus")}<input name="name" value={form.name} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Pilote")}<input value={form.pilote} disabled className={`${inputClass} bg-gray-100`} /></div>
              <div>{label("Désignation")}<input name="desig" value={form.desig} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Objectif")}<textarea rows={2} name="objectif" value={form.objectif} onChange={handleChange} className={inputClass} /></div>
              <div>
                {label("Structures concernées")}
                <select name="structures" value={form.structures} onChange={handleChange} className={inputClass}>
                  <option>RH</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Production</option>
                </select>
              </div>
              <div>
                {label("Type")}
                <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                  <option>Management</option>
                  <option>Support</option>
                  <option>Réalisation</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>{label("Délai")}<input name="delai" value={form.delai} onChange={handleChange} className={inputClass} /></div>
                <div>{label("Coût")}<input name="cout" value={form.cout} onChange={handleChange} className={inputClass} /></div>
              </div>
              <div>{label("Entrées")}<textarea rows={2} name="entrees" value={form.entrees} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Sorties")}<textarea rows={2} name="sorties" value={form.sorties} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Clients")}<input name="clients" value={form.clients} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Effectifs")}<input name="effectifs" value={form.effectifs} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Compétences")}<textarea rows={2} name="competences" value={form.competences} onChange={handleChange} className={inputClass} /></div>
            </>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <>
              <div>{label("Processus voisins")}<textarea rows={2} name="voisins" value={form.voisins} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Enjeux")}<textarea rows={2} name="enjeux" value={form.enjeux} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Moyens")}<textarea rows={2} name="moyens" value={form.moyens} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Contraintes")}<textarea rows={2} name="contraintes" value={form.contraintes} onChange={handleChange} className={inputClass} /></div>
              <div>{label("Risques")}<textarea rows={2} name="risques" value={form.risques} onChange={handleChange} className={inputClass} /></div>
            </>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <>
              {form.kpis.map((kpi, index) => (
                <div key={index} className="border border-[#E2E8F0] rounded-md p-3 space-y-2">
                  <input placeholder="Indicateur" value={kpi.label}
                    onChange={(e) => handleKpiChange(index, "label", e.target.value)}
                    className={inputClass} />
                  <input placeholder="Cible" value={kpi.cible}
                    onChange={(e) => handleKpiChange(index, "cible", e.target.value)}
                    className={inputClass} />
                  <select value={kpi.frequence}
                    onChange={(e) => handleKpiChange(index, "frequence", e.target.value)}
                    className={inputClass}>
                    <option>Mensuel</option>
                    <option>Trimestriel</option>
                    <option>Semestriel</option>
                    <option>Annuel</option>
                  </select>
                </div>
              ))}
              <button onClick={addKpi}
                className="text-xs text-[#2F4157] border border-[#567C8E] px-3 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
                + Ajouter KPI
              </button>
            </>
          )}

{/* STEP 5 */}
{step === 4 && (
  <div className="space-y-3">

    {label("BPMN")}

    {/* Upload zone */}
    <label className="block cursor-pointer">
      <div className="border-2 border-dashed border-[#A2C1D1] rounded-xl p-6 bg-white hover:bg-[#F1F7FA] transition text-center">

        <div className="text-[#2F4157] font-medium text-sm">
          Importer le fichier BPMN
        </div>

        <div className="text-[11px] text-[#567C8E] mt-1">
          Glissez-déposez ou cliquez pour sélectionner
        </div>

        <input
          type="file"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </label>

    {/* File preview */}
    {form.bpmnFile && (
      <div className="flex items-center justify-between bg-[#EAF2F7] border border-[#C8D9E6] rounded-lg px-3 py-2">

        <div className="text-[12px] text-[#2F4157] font-medium truncate">
          {form.bpmnFile}
        </div>

        <span className="text-green-600 text-[12px] font-semibold">
          ✓ Chargé
        </span>

      </div>
    )}

  </div>
)}

        </div>

        {/* ACTIONS STICKY */}
        <div className="sticky bottom-0 bg-[#F8FAFC] border-t border-[#E2E8F0] py-3 flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-1.5 text-xs border rounded-md border-[#567C8E] text-[#567C8E] disabled:opacity-40 cursor-pointer hover:bg-slate-50"
          >
            Retour
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={nextStep}
              className="px-4 py-1.5 text-xs bg-[#2F4157] text-white rounded-md hover:bg-[#1f2c3d] cursor-pointer">
              Suivant
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="px-4 py-1.5 text-xs bg-[#2F4157] text-white rounded-md hover:bg-[#1f2c3d] cursor-pointer">
              Enregistrer
            </button>
          )}
        </div>

      </div>
    </div>
  );
}