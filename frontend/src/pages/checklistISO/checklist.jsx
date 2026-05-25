import { useState } from "react";
import { API_URL } from '../../api.js'


const PROCESSES = [
  { id: 0, name: "Gestion pédagogique" },
  { id: 1, name: "Recrutement des étudiants" },
  { id: 2, name: "Gestion des RH" },
  { id: 3, name: "Audit interne" },
  { id: 4, name: "Pilotage stratégique" },
  { id: 5, name: "Gestion des achats" },
];

const BLOCS = [
  {
    num: "BLOC 1", title: "Définition & contexte du processus", clause: "Clause 4.4",
    items: [
      "Le processus a un nom et un identifiant unique",
      "La finalité (raison d'être) du processus est clairement définie",
      "Le périmètre du processus est délimité (début et fin)",
      "Les éléments d'entrée du processus sont identifiés",
      "Les éléments de sortie du processus sont identifiés",
      "Les liens avec les autres processus (amont/aval) sont cartographiés",
      "Le pilote du processus est désigné nommément",
      "Les parties prenantes internes et externes du processus sont identifiées",
      "Les exigences légales et réglementaires applicables au processus sont identifiées",
    ],
  },
  {
    num: "BLOC 2", title: "Risques & opportunités", clause: "Clause 6.1",
    items: [
      "Les risques liés au processus sont identifiés",
      "Les risques sont évalués (probabilité × impact)",
      "Des actions de traitement des risques sont définies",
      "Les opportunités liées au processus sont identifiées",
      "Des actions pour saisir les opportunités sont planifiées",
      "L'efficacité des actions sur les risques/opportunités est évaluée",
      "Les risques liés aux prestataires externes intervenant dans ce processus sont évalués",
    ],
  },
  {
    num: "BLOC 3", title: "Ressources", clause: "Clause 7.1",
    items: [
      "Les ressources humaines nécessaires au processus sont définies et disponibles",
      "Les équipements/matériels nécessaires au processus sont définis et disponibles",
      "L'infrastructure nécessaire (locaux, IT, transport) est disponible et maintenue",
      "L'environnement de travail approprié est assuré (physique, social, psychologique)",
      "Les équipements de mesure utilisés dans le processus sont étalonnés/vérifiés",
      "Les connaissances organisationnelles nécessaires au processus sont identifiées et accessibles",
    ],
  },
  {
    num: "BLOC 4", title: "Compétences & sensibilisation", clause: "Clauses 7.2 / 7.3",
    items: [
      "Les compétences requises pour chaque rôle dans le processus sont définies",
      "Le personnel affecté au processus possède les compétences requises (formation, diplôme, expérience)",
      "Des actions de développement des compétences sont planifiées si des écarts existent",
      "L'efficacité des formations liées au processus est évaluée",
      "Les informations documentées sur les compétences sont conservées",
      "Le personnel connaît les objectifs qualité liés à ce processus",
      "Le personnel comprend sa contribution à l'efficacité du SMQ via ce processus",
      "Le personnel est sensibilisé aux conséquences de la non-conformité dans ce processus",
    ],
  },
  {
    num: "BLOC 5", title: "Documentation & informations documentées", clause: "Clause 7.5",
    items: [
      "Une procédure ou mode opératoire du processus existe",
      "La procédure est approuvée, datée et versionnée",
      "La procédure est accessible aux personnes concernées",
      "Les enregistrements qualité liés au processus sont définis",
      "Les enregistrements sont lisibles, identifiables et récupérables",
      "Les durées de conservation des enregistrements sont définies",
      "Les documents obsolètes sont retirés ou marqués",
      "Les documents d'origine externe utilisés dans le processus sont identifiés et maîtrisés",
    ],
  },
  {
    num: "BLOC 6", title: "Planification & maîtrise opérationnelle", clause: "Clause 8.1",
    items: [
      "Les étapes/activités du processus sont clairement séquencées",
      "Les critères de maîtrise à chaque étape sont définis",
      "Les critères d'acceptation des éléments de sortie du processus sont définis",
      "Les modifications planifiées du processus sont gérées et documentées",
      "Les modifications non intentionnelles sont détectées et analysées",
      "Des actions correctives sont menées si les modifications ont des effets indésirables",
      "Les activités externalisées dans ce processus sont identifiées et maîtrisées",
    ],
  },
  {
    num: "BLOC 7", title: "Communication", clause: "Clause 7.4",
    items: [
      "Les besoins de communication interne liés au processus sont définis (quoi, quand, à qui, comment)",
      "Les besoins de communication externe liés au processus sont définis",
      "La communication est effective et vérifiable",
    ],
  },
  {
    num: "BLOC 8", title: "Orientation client & parties intéressées", clause: "Clauses 5.1.2 / 4.2",
    items: [
      "Les exigences des clients relatifs à ce processus sont déterminées",
      "Les exigences légales et réglementaires applicables à ce processus sont respectées",
      "La satisfaction des clients/bénéficiaires de ce processus est prise en compte",
      "Les retours et réclamations liés à ce processus sont collectés et traités",
      "Les exigences des parties intéressées impactées par ce processus sont prises en compte",
    ],
  },
  {
    num: "BLOC 9", title: "Indicateurs & mesure de performance", clause: "Clause 9.1",
    items: [
      "Des indicateurs de performance (KPI) sont définis pour ce processus",
      "Les KPI sont mesurables et mesurés à une fréquence définie",
      "Les résultats des KPI sont analysés et évalués",
      "Les résultats sont comparés aux objectifs fixés",
      "Les informations documentées des mesures sont conservées",
      "Les résultats sont communiqués aux personnes concernées et à la direction",
    ],
  },
  {
    num: "BLOC 10", title: "Audit & vérification interne", clause: "Clause 9.2",
    items: [
      "Le processus est inclus dans le programme d'audit interne",
      "Des audits internes du processus sont réalisés à intervalles planifiés",
      "Les auditeurs sont impartiaux (ne s'auditent pas eux-mêmes)",
      "Les résultats d'audit sont documentés et communiqués au pilote du processus",
      "Les non-conformités détectées lors des audits sont traitées",
    ],
  },
  {
    num: "BLOC 11", title: "Non-conformités & actions correctives", clause: "Clause 10.2",
    items: [
      "Un mécanisme d'identification des non-conformités dans ce processus existe",
      "Les non-conformités sont enregistrées et décrites",
      "Une réaction immédiate (correction) est apportée à chaque non-conformité",
      "L'analyse des causes racines est réalisée",
      "Des actions correctives sont définies et mises en œuvre",
      "L'efficacité des actions correctives est vérifiée",
      "Les leçons apprises sont capitalisées et partagées",
      "Les informations documentées sur les NC et AC sont conservées",
    ],
  },
  {
    num: "BLOC 12", title: "Amélioration continue", clause: "Clause 10.3",
    items: [
      "Des opportunités d'amélioration du processus sont identifiées régulièrement",
      "Des actions d'amélioration sont planifiées et mises en œuvre",
      "Les résultats des améliorations sont mesurés et documentés",
      "Le processus est revu lors de la revue de direction",
      "Les données d'analyse (9.1.3) alimentent l'amélioration du processus",
    ],
  },
  {
    num: "BLOC 13", title: "Revue de direction (contribution du processus)", clause: "Clause 9.3",
    items: [
      "Le pilote du processus prépare un rapport de performance pour la revue de direction",
      "Les données incluent : KPI, NC, AC, risques, satisfaction client, ressources",
      "Les décisions de la revue de direction concernant ce processus sont tracées et appliquées",
    ],
  },
];

// ── Score helpers ──────────────────────────────────────────────
function scoreColor(pct) {
  if (pct >= 70) return { text: "text-emerald-600", bar: "bg-emerald-500" };
  if (pct >= 40) return { text: "text-amber-600", bar: "bg-amber-500" };
  return { text: "text-red-500", bar: "bg-red-500" };
}

// SCORE PAR CLAUSE
function calcBlocScore(checked) {
  const total = checked.length;
  const done = checked.filter(Boolean).length;

  return {
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
  };
}

// SCORE GLOBAL = MOYENNE DES SCORES DES CLAUSES
function calcGlobalScore(allChecks) {
  const clauseScores = allChecks.map((bloc) => {
    const total = bloc.length;
    const done = bloc.filter(Boolean).length;

    return total ? (done / total) * 100 : 0;
  });

  const sum = clauseScores.reduce((acc, val) => acc + val, 0);

  const pct = clauseScores.length
    ? Math.round(sum / clauseScores.length)
    : 0;

  return { pct };
}

// ── Sub-components ────────────────────────────────────────────
function ProgressBar({ pct, className = "" }) {
  const { bar } = scoreColor(pct);

  return (
    <div className={`h-1.5 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${bar}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function BlocCard({ bloc, bi, checked, onToggle }) {
  const [open, setOpen] = useState(bi === 0);

  const { done, total, pct } = calcBlocScore(checked);
  const { text } = scoreColor(pct);

  return (
    <div className="bg-white border border-[#A2C1D1]/20 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "#EEF2F6" }}
        className="w-full flex items-center gap-2.5 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#A2C1D1]/30 text-gray-500 shrink-0">
          {bloc.num}
        </span>

        <span className="flex-1 text-[13px] font-medium text-[#2F4157]">
          {bloc.title}
        </span>

        <span className="text-[11px] text-gray-400 hidden sm:inline">
          {bloc.clause}
        </span>

        <ProgressBar pct={pct} className="w-14  bg-white hidden sm:block" />

        <span className={`text-[12px] font-medium min-w-[42px] text-right ${text}`}>
          {pct}%
        </span>

        <span
          className={`text-[10px] text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Body */}
      {open ? (
        <div className="border-t border-gray-100 px-5 py-3 flex flex-col gap-0.5">
          {bloc.items.map((item, ii) => (
            <label
              key={ii}
              className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div
                onClick={() => onToggle(bi, ii)}
                className={`mt-0.5 w-4 h-4 min-w-[16px] rounded border flex items-center justify-center transition-colors
                  ${
                    checked[ii]
                      ? "bg-[#2F4157] border-[#2F4157]"
                      : "bg-white border-gray-300"
                  }`}
              >
                {checked[ii] && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <span
                onClick={() => onToggle(bi, ii)}
                className="text-[12px] text-gray-700 leading-relaxed"
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function CheckListISO() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // checks[processIdx][blocIdx][itemIdx]
  const [checks, setChecks] = useState(() =>
    PROCESSES.map(() =>
      BLOCS.map((b) => b.items.map(() => false))
    )
  );

  const [toast, setToast] = useState(false);

  const handleToggle = (bi, ii) => {
    setChecks((prev) => {
      const next = prev.map((proc, pi) =>
        pi !== selectedIdx
          ? proc
          : proc.map((bloc, b) =>
              b !== bi
                ? bloc
                : bloc.map((v, i) => (i === ii ? !v : v))
            )
      );

      return next;
    });
  };

  const handleSave = () => {
    setToast(true);

    setTimeout(() => setToast(false), 2800);
  };

  const currentChecks = checks[selectedIdx];

  const { pct } = calcGlobalScore(currentChecks);
  const { text, bar } = scoreColor(pct);

  return (   

        <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Check List ISO 9001 - 2015
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-5">

        <div className="w-full">
          <div className="flex gap-2 items-center">
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#567C8E] rounded-lg text-[13px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1] cursor-pointer"
            >
              {PROCESSES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              className="px-3 py-2 text-white text-[12px] font-medium rounded-lg transition-colors"
              style={{ background: "#2F4157" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1f2c3d")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#2F4157")
              }
            >
              Enregistrer
            </button>
          </div>

          {/* Global score */}
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex items-center gap-3 mt-3">
            <span className="text-[12px] text-gray-500 min-w-[80px]">
              Score global
            </span>

            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <span
              className={`text-[13px] font-medium min-w-[42px] text-right ${text}`}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* BLOCS */}
        <div className="grid grid-cols-2 gap-3.5">
          {BLOCS.map((bloc, bi) => (
            <BlocCard
              key={bi}
              bloc={bloc}
              bi={bi}
              checked={currentChecks[bi]}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-[#E1F5EE] border border-[#2F4157] text-[#2F4157] text-[12px] px-4 py-2.5 rounded-lg shadow-lg z-50">
            ✓&nbsp;&nbsp;Check list enregistrée
          </div>
        )}
      </div>
    </div>
  );
}