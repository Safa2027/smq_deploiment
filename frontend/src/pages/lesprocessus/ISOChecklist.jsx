import { useState } from "react";
import { ChevronLeft } from "lucide-react";


const QUESTIONS = [
  // BLOC 1
  { id: 1, clause: "4.4", text: "Le processus a une finalité et un périmètre clairement définis." },
  { id: 2, clause: "4.4", text: "Les entrées, sorties et interactions avec d'autres processus sont identifiées." },
  { id: 3, clause: "4.4", text: "Un pilote de processus est désigné." },

  // BLOC 2
  { id: 4, clause: "6.1", text: "Les risques du processus sont identifiés et évalués." },
  { id: 5, clause: "6.1", text: "Des actions de traitement des risques sont définies." },

  // BLOC 3
  { id: 6, clause: "7.1", text: "Les ressources nécessaires sont disponibles (humaines et matérielles)." },
  { id: 7, clause: "7.2", text: "Les compétences du personnel sont définies et maîtrisées." },

  // BLOC 4
  { id: 8, clause: "7.5", text: "Une procédure documentée du processus existe et est maîtrisée." },
  { id: 9, clause: "7.5", text: "Les enregistrements qualité sont conservés et accessibles." },

  // BLOC 5
  { id: 10, clause: "8.1", text: "Les activités du processus sont planifiées et maîtrisées." },
  { id: 11, clause: "8.1", text: "Les critères de qualité des sorties sont définis." },

  // BLOC 6
  { id: 12, clause: "9.1", text: "Des indicateurs de performance (KPI) sont définis et suivis." },
  { id: 13, clause: "9.1", text: "Les résultats sont analysés régulièrement." },

  // BLOC 7
  { id: 14, clause: "10.2", text: "Les non-conformités sont enregistrées et traitées." },
  { id: 15, clause: "10.3", text: "Des actions d’amélioration continue sont mises en place." },
];


const OPTIONS = [
  {
    value: "oui",
    label: "Oui",
    score: 1,
    style: { bg: "#E1F5EE", color: "#0F6E56", border: "#5DCAA5" },
  },
  {
    value: "non",
    label: "Non",
    score: 0,
    style: { bg: "#FCEBEB", color: "#A32D2D", border: "#F09595" },
  },
];


export default function ISOChecklist({ processName, onDone, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const total = QUESTIONS.length;

  const rawScore = Object.values(answers).reduce((sum, v) => {
    const opt = OPTIONS.find((o) => o.value === v);
    return sum + (opt?.score || 0);
  }, 0);

  const scorePercent = Math.round((rawScore / total) * 100);


  const accepted = scorePercent >= 50;

  const allAnswered = answered === total;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    console.log("[ISOChecklist] Submitting checklist — score:", scorePercent, "accepted:", accepted);
    setSubmitted(true);
  };

 
  if (submitted) {
    return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">Résultat ISO</span>
        </div>
      </header>
      
        <div className="max-w-lg mx-auto p-6 flex flex-col items-center gap-6 pt-12">

          {/* SCORE */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center border-4"
              style={{
                borderColor: accepted ? "#5DCAA5" : "#F09595",
                background: accepted ? "#E1F5EE" : "#FCEBEB",
              }}
            >
              <span
                className="text-3xl font-semibold"
                style={{ color: accepted ? "#0F6E56" : "#A32D2D" }}
              >
                {scorePercent}%
              </span>
            </div>

            <span
              className="text-sm font-medium"
              style={{ color: accepted ? "#0F6E56" : "#A32D2D" }}
            >
              {accepted ? "Processus partiellement conforme" : "Processus non conforme"}
            </span>
          </div>

          {/* MESSAGE */}
          <div
            className="w-full rounded-xl p-4 text-sm text-center"
            style={{
              background: accepted ? "#E1F5EE" : "#FCEBEB",
              color: accepted ? "#0F6E56" : "#A32D2D",
              border: `1px solid ${accepted ? "#5DCAA5" : "#F09595"}`,
            }}
          >
            {accepted
              ? "Le processus est partiellement conforme aux exigences ISO 9001."
              : "Processus non conforme. Des améliorations sont obligatoires avant validation."}
          </div>

          {/* BUTTON */}
          <button
            onClick={() => onDone(scorePercent, accepted)}
            className="w-full py-2.5 bg-[#2F4157] text-white rounded-xl text-sm font-medium"
          >
            Retour à mes processus
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     🔷 MAIN UI
  ========================= */
  return (
              <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <button onClick={onBack} className="text-[#2F4157]">
  <ChevronLeft size={20} />
</button>
          <span className="text-lg font-medium text-[#2F4157]">Checklist ISO 9001</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {/* PROCESS */}
        <div className="bg-white rounded-lg px-3 py-2 border border-[#E2E8F0]">
          <p className="text-[11px] text-[#567C8E]">Processus évalué</p>
          <p className="text-sm font-medium text-[#2F4157]">
            {processName}
          </p>
        </div>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between text-[11px] text-[#567C8E] mb-1">
            <span>Progression</span>
            <span>{answered}/{total}</span>
          </div>

          <div className="h-1.5 w-full bg-gray-100 rounded-full">
            <div
              className="h-1.5 bg-[#2F4157] rounded-full transition-all"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4"
            >
              <div className="flex gap-2 mb-3">
                <span className="text-[11px] bg-[#f0f4f7] px-2 py-0.5 rounded text-[#567C8E]">
                  §{q.clause}
                </span>
                <p className="text-[13px] text-[#1f2c3d]">
                  {q.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setAnswers((p) => ({
                        ...p,
                        [q.id]: opt.value,
                      }))
                    }
                    className="py-2 rounded-lg text-sm font-medium border"
                    style={
                      answers[q.id] === opt.value
                        ? {
                            background: opt.style.bg,
                            color: opt.style.color,
                            border: `1px solid ${opt.style.border}`,
                          }
                        : {
                            background: "#fff",
                            color: "#567C8E",
                            borderColor: "#C8D9E6",
                          }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={
            allAnswered
              ? { background: "#2F4157", color: "#fff" }
              : { background: "#E2E8F0", color: "#94A3B8" }
          }
        >
          {allAnswered
            ? "Valider la checklist"
            : `Répondez aux ${total - answered} questions`}
        </button>
      </div>
    </div>
  );
}
