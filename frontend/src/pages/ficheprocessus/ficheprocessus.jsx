import { useState, useEffect } from "react";

const FICHE_DATA = [
  {
    name: "Gestion pédagogique",
    pilote: "Direction des Études (DE)",
    desig: "Gestion pédagogique",
    objectif: "Assurer la qualité et la continuité des formations dispensées à l'ESI",
    structures: "DE, Départements pédagogiques, Bibliothèque",
    type: "Réalisation",
    delai: "Semestre académique (6 mois)",
    cout: "Budget pédagogique annuel",
    entrees: "Programmes académiques officiels\nDemandes des étudiants\nRéférentiels de compétences",
    sorties: "Emplois du temps validés\nRésultats académiques\nRelevés de notes",
    clients: "Étudiants, Entreprises partenaires, MESRS",
    effectifs: "45 enseignants permanents, 20 vacataires",
    competences: "Expertise disciplinaire, pédagogie active, évaluation",
    voisins: "Recrutement (amont) → Gestion RH (support)",
    enjeux: "Qualité des diplômés, accréditation des formations",
    moyens: "Plateforme LMS, salles de cours, labs",
    contraintes: "Calendrier MESRS, quota enseignants, emplois du temps",
    risques: "Absence enseignants, surcharge, résultats insuffisants",
    kpis: [
      { label: "Taux de réussite", cible: "≥ 80%" },
      { label: "Taux de présence", cible: "≥ 85%" },
      { label: "Satisfaction étudiants", cible: "≥ 3.5/5" },
    ],
  },
  {
    name: "Recrutement des étudiants",
    pilote: "Direction des Études (DE)",
    desig: "Recrutement et orientation",
    objectif: "Sélectionner les candidats les plus aptes à réussir à l'ESI",
    structures: "DE, Commission de sélection, Scolarité",
    type: "Réalisation",
    delai: "3 mois (mars–juin)",
    cout: "Budget concours",
    entrees: "Dossiers de candidature\nRésultats du bac\nTests d'entrée",
    sorties: "Liste des admis\nLettre de convocation\nAttestation d'inscription",
    clients: "Candidats, familles, MESRS",
    effectifs: "10 membres commission, équipe scolarité",
    competences: "Évaluation, communication, gestion bases de données",
    voisins: "Orientation scolaire (amont) → Gestion pédagogique (aval)",
    enjeux: "Qualité du recrutement, réputation de l'ESI",
    moyens: "Plateforme Progres, salles examen, jury",
    contraintes: "Calendrier MESRS, quota places, délais affichage",
    risques: "Fraude, recours, désistements, manque de candidats",
    kpis: [
      { label: "Taux de sélection", cible: "—" },
      { label: "Taux de rétention 1ère année", cible: "—" },
      { label: "Délai traitement dossiers", cible: "—" },
    ],
  },
  {
    name: "Gestion des RH",
    pilote: "Direction des Ressources Humaines (DRH)",
    desig: "Gestion des ressources humaines",
    objectif: "Assurer la disponibilité et la compétence du personnel de l'ESI",
    structures: "DRH, Directions fonctionnelles",
    type: "Support",
    delai: "Annuel",
    cout: "Budget RH annuel",
    entrees: "Besoins en recrutement\nDemandes de formation\nEvaluations du personnel",
    sorties: "Contrats de travail\nPlans de formation\nFiches d'évaluation",
    clients: "Ensemble du personnel ESI",
    effectifs: "Équipe DRH (5 personnes)",
    competences: "Droit du travail, gestion des compétences, formation",
    voisins: "Direction générale (amont) → Tous les processus (support)",
    enjeux: "Disponibilité des compétences, motivation du personnel",
    moyens: "SIRH, budgets de formation, outils d'évaluation",
    contraintes: "Statut de la fonction publique, budget limité",
    risques: "Départ de compétences clés, absentéisme, manque de formation",
    kpis: [
      { label: "Taux d'absentéisme", cible: "≤ 5%" },
      { label: "Taux de réalisation des formations", cible: "≥ 90%" },
      { label: "Satisfaction personnel", cible: "≥ 3/5" },
    ],
  },
  {
    name: "Audit interne",
    pilote: "Cellule Assurance Qualité (CAQ)",
    desig: "Audit interne qualité",
    objectif: "Vérifier la conformité du SMQ aux exigences ISO 9001:2015",
    structures: "CAQ, Auditeurs internes, Directions auditées",
    type: "Management",
    delai: "Annuel (4 cycles/an)",
    cout: "Budget audit",
    entrees: "Programme d'audit\nRéférentiels ISO 9001\nRapports d'audit précédents",
    sorties: "Rapports d'audit\nFiches de non-conformité\nPlan d'actions correctives",
    clients: "Direction ESI, Organismes de certification",
    effectifs: "2 auditeurs internes (à former)",
    competences: "Techniques d'audit, ISO 9001, communication",
    voisins: "Tous les processus (audités) → Direction (rapport)",
    enjeux: "Crédibilité de la certification, amélioration continue",
    moyens: "Grilles d'audit, outils de rapport, planning",
    contraintes: "Disponibilité des audités, compétences auditeurs",
    risques: "Biais d'audit, non-suivi des actions, manque de ressources",
    kpis: [
      { label: "Taux de réalisation du programme", cible: "100%" },
      { label: "Délai de clôture des NC", cible: "≤ 90j" },
      { label: "Taux d'actions efficaces", cible: "≥ 80%" },
    ],
  },
  {
    name: "Pilotage stratégique",
    pilote: "Direction Générale",
    desig: "Pilotage et management stratégique",
    objectif: "Définir et déployer la stratégie de l'ESI pour atteindre l'excellence académique",
    structures: "Direction, Conseil scientifique, Départements",
    type: "Management",
    delai: "Annuel / Pluriannuel",
    cout: "Budget de direction",
    entrees: "Orientations MESRS\nRésultats de la revue de direction\nAnalyse SWOT",
    sorties: "Plan stratégique ESI\nObjectifs qualité\nPolitique qualité",
    clients: "Ensemble des parties prenantes ESI",
    effectifs: "Comité de direction (8 membres)",
    competences: "Management stratégique, leadership, qualité",
    voisins: "MESRS (amont) → Tous les processus (pilotage)",
    enjeux: "Positionnement de l'ESI, accréditation, excellence",
    moyens: "Tableau de bord stratégique, outils de reporting",
    contraintes: "Contraintes budgétaires, réglementation MESRS",
    risques: "Changement de politique, résistance au changement",
    kpis: [
      { label: "Taux de conformité global", cible: "≥ 75%" },
      { label: "Objectifs qualité atteints", cible: "≥ 80%" },
      { label: "Satisfaction parties prenantes", cible: "≥ 4/5" },
    ],
  },
  {
    name: "Gestion des achats",
    pilote: "Direction Financière et Comptable (DFC)",
    desig: "Gestion des achats et approvisionnements",
    objectif: "Assurer la disponibilité des ressources matérielles dans les délais et budgets",
    structures: "DFC, Commission des marchés, Directions utilisatrices",
    type: "Support",
    delai: "Selon les marchés (3–12 mois)",
    cout: "Budget achats annuel",
    entrees: "Demandes d'achat\nBudget alloué\nRéférentiel fournisseurs",
    sorties: "Bons de commande\nContrôle réception\nEvaluation fournisseurs",
    clients: "Toutes les directions de l'ESI",
    effectifs: "Équipe DFC (3 personnes achats)",
    competences: "Réglementation marchés publics, négociation, gestion stocks",
    voisins: "Directions utilisatrices (amont) → DFC (traitement)",
    enjeux: "Disponibilité des ressources, optimisation des coûts",
    moyens: "Système de gestion des achats, catalogue fournisseurs",
    contraintes: "Code des marchés publics, délais administratifs",
    risques: "Retards livraison, fournisseurs défaillants, dépassements budget",
    kpis: [
      { label: "Délai moyen de traitement", cible: "≤ 30j" },
      { label: "Taux de livraison dans les délais", cible: "≥ 85%" },
      { label: "Taux de conformité réception", cible: "≥ 95%" },
    ],
  },
];

const TYPE_COLORS = {
  Management: "bg-[#E1F5EE] text-[#2F4157]",
  Réalisation: "bg-[#E1F5EE] text-[#567C8E]",
  Support: "bg-[#FAEEDA] text-[#2F4157]",
};

function Field({ label, value, multiline }) {
  return (
    <div className="flex gap-3 px-4 py-2.5 border-b border-[#A2C1D1]/20 last:border-b-0">
      <div className="text-[11px] text-[#567C8E] min-w-[130px] pt-0.5">{label}</div>
      <div className="flex-1 text-[12px] text-[#1f2c3d]">
        {multiline ? (
          <span style={{ whiteSpace: "pre-line" }}>{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#A2C1D1]/20"
    style={{ background: "#EEF2F6" }}>
      <span className=" text-[10px] text-[#2F4157]">{num}</span>
      <span className="text-[12px] font-medium text-[#2F4157]">{title}</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#A2C1D1]/30 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function FicheProcessus() {
  const [processes, setProcesses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [ficheData, setFicheData] = useState(null);
  const [, setLoadingFiche] = useState(false);
  const [toast, setToast] = useState(false);
  const [bpmnFile, setBpmnFile] = useState(null);
  const data = ficheData || {};

  useEffect(() => {
    const fetchProcesses = async () => {
      console.log("[FicheProcessus] Fetching process list...");
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
        const data = await res.json();
        console.log("[FicheProcessus] Processes:", data);
        setProcesses(data.map(p => ({ id: p.id, name: p.designation })));
      } catch (err) {
        console.error("[FicheProcessus] Fetch process list error:", err);
      }
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    if (!processes.length) return;
    const selected = processes[selectedIdx];
    if (!selected) return;

    const fetchFiche = async () => {
      setLoadingFiche(true);
      console.log("[FicheProcessus] Fetching fiche for process:", selected.id);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/processus/${selected.id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        console.log("[FicheProcessus] Fiche detail:", data);

        setFicheData({
          pilote: data.pilote_detail?.full_name || "—",
          desig: data.designation || "",
          objectif: data.objectif || "",
          structures: data.structure?.nom_structure || "—",
          type: data.type_processus || "Support",
          delai: "—",
          cout: "—",
          entrees: "—",
          sorties: "—",
          clients: "—",
          effectifs: "—",
          competences: "—",
          voisins: "—",
          enjeux: "—",
          moyens: data.moyens?.description || "—",
          contraintes: data.contraintes?.map(c => c.description).join("\n") || "—",
          risques: data.anomalies?.map(a => a.description).join("\n") || "—",
          kpis: data.kpis?.map(k => ({
            label: k.kpi.indicateur,
            cible: k.kpi.cible,
            frequence: k.frequence,
          })) || [],
        });
      } catch (err) {
        console.error("[FicheProcessus] Fiche fetch error:", err);
      } finally {
        setLoadingFiche(false);
      }
    };
    fetchFiche();
  }, [selectedIdx, processes]);

  const handleSave = async () => {
    const selected = processes[selectedIdx];
    console.log("[FicheProcessus] Saving fiche for process:", selected?.id);
    if (bpmnFile) {
      console.log("[FicheProcessus] BPMN file attached:", bpmnFile.name, "— upload not yet implemented");
    }
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Fiche du processus
          </span>
        </div>
      </header>

      <div className="w-full space-y-6 p-6">
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#567C8E] rounded-lg text-[13px] text-[#1f2c3d] focus:outline-none focus:ring-2 focus:ring-[#A2C1D1] cursor-pointer"
            >
              {processes.map((p, i) => (
                <option key={p.id} value={i}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={handleSave}
              className="px-3 py-2 text-white text-[12px] font-medium rounded-lg transition-colors"
              style={{ background: "#2F4157" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1f2c3d"}
              onMouseLeave={e => e.currentTarget.style.background = "#2F4157"}
            >
              Enregistrer
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3.5">
            <Card>
              <SectionHeader num="01" title="Informations générales" />
              <Field label="Pilote du processus" value={data.pilote} />
              <Field label="Désignation" value={data.desig} />
              <Field label="Objectif" value={data.objectif} multiline />
              <Field label="Structures concernées" value={data.structures} />
              <div className="flex gap-3 px-4 py-2.5 border-b border-[#A2C1D1]/20 last:border-b-0">
                <div className="text-[11px] text-[#567C8E] min-w-[130px] pt-0.5">Type de processus</div>
                <div className="flex-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${TYPE_COLORS[data.type] || "bg-[#FAEEDA] text-[#2F4157]"}`}>
                    {data.type}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader num="03" title="Contexte et environnement" />
              <Field label="Processus voisins" value={data.voisins} />
              <Field label="Enjeux stratégiques" value={data.enjeux} />
              <Field label="Moyens alloués" value={data.moyens} />
              <Field label="Contraintes" value={data.contraintes} />
              <Field label="Risques identifiés" value={data.risques} multiline />
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3.5">
            <Card>
              <SectionHeader num="02" title="Éléments clés du processus" />
              <Field label="Délai global" value={data.delai} />
              <Field label="Coût estimé" value={data.cout} />
              <Field label="Entrées" value={data.entrees} multiline />
              <Field label="Sorties / Livrables" value={data.sorties} multiline />
              <Field label="Clients (bénéficiaires)" value={data.clients} />
              <Field label="Effectifs impliqués" value={data.effectifs} />
              <Field label="Compétences clés" value={data.competences} />
            </Card>

            <Card>
              <SectionHeader num="04" title="Indicateurs de performance (KPIs)" />
              <div className="p-3">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-[#A2C1D1]/20">
                      <th className="py-1.5 px-2 text-left text-[10px] font-medium text-[#567C8E] uppercase tracking-wide">Indicateur</th>
                      <th className="py-1.5 px-2 text-left text-[10px] font-medium text-[#567C8E] uppercase tracking-wide">Cible</th>
                      <th className="py-1.5 px-2 text-left text-[10px] font-medium text-[#567C8E] uppercase tracking-wide">Fréquence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.kpis || []).map((kpi, i) => (
                      <tr key={i} className="border-b border-[#A2C1D1]/20 last:border-b-0">
                        <td className="py-2 px-2 text-[#567C8E]">{kpi.label}</td>
                        <td className="py-2 px-2 font-mono text-[11px] text-[#2F4157] font-semibold">{kpi.cible}</td>
                        <td className="py-2 px-2 text-[#567C8E]">Semestriel</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 05 — BPMN */}
<Card className="mt-3.5">
  <SectionHeader num="05" title="Déroulement et modélisation (BPMN)" />

  <div className="p-5 flex justify-center">
    <div className="w-full border border-dashed border-[#567C8E]/40 rounded-lg p-6 text-center bg-[#FAFCFE]">

      {!bpmnFile ? (
        <>
          <div className="text-[30px] opacity-30 mb-2">⬡</div>

          <p className="text-[12px] text-[#567C8E] mb-4">
            Importez un schéma BPMN, une image ou un PDF
          </p>

          <label
            className="inline-block px-4 py-2 text-[11px] font-medium text-white border border-[#567C8E] rounded-lg cursor-pointer transition-colors"
            style={{ background: "#2F4157" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#1f2c3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#2F4157")
            }
          >
            + Importer fichier

            <input
              type="file"
              accept=".bpmn,.xml,.png,.svg,.jpg,.jpeg,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setBpmnFile({
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                  });
                }
              }}
            />
          </label>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#A2C1D1]/30 rounded-lg px-4 py-3">
            <p className="text-[12px] text-[#2F4157] font-medium">
              ✓ {bpmnFile.name}
            </p>

            <button
              onClick={() => setBpmnFile(null)}
              className="text-[11px] text-red-500 hover:underline"
            >
              Supprimer
            </button>
          </div>

          {/* IMAGE */}
          {bpmnFile.type.includes("image") && (
            <img
              src={bpmnFile.url}
              alt="BPMN"
              className="w-full max-h-[500px] object-contain border border-[#E2E8F0] rounded-lg bg-white"
            />
          )}

          {/* PDF */}
          {bpmnFile.type === "application/pdf" && (
            <iframe
              src={bpmnFile.url}
              title="PDF BPMN"
              className="w-full h-[600px] border border-[#E2E8F0] rounded-lg bg-white"
            />
          )}

          {/* XML / BPMN */}
          {(bpmnFile.type.includes("xml") ||
            bpmnFile.name.endsWith(".bpmn")) && (
            <div className="border border-[#E2E8F0] rounded-lg bg-white p-6 text-[12px] text-[#567C8E]">
              Fichier BPMN importé avec succès.
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</Card>

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-[#E1F5EE] border border-[#2F4157] text-[#2F4157] text-[12px] px-4 py-2.5 rounded-lg shadow-lg z-50">
            ✓&nbsp;&nbsp;Fiche processus enregistrée
          </div>
        )}
      </div>
    </div>
  );
}
