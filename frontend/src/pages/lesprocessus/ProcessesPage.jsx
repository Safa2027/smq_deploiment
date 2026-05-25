import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProcessCard from "../../components/ProcessCard";
import AddFichePopup from "./AddFichePopup";
import AddProcessForm from "./addprocessform";
import ISOChecklist from "./ISOChecklist";

const TYPES = ["Tous", "Management", "Support", "Réalisation"];

export default function MesProcessus() {
  const navigate = useNavigate();

  const [processus, setProcessus] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [page, setPage] = useState(1);

  const [selectedProcess, setSelectedProcess] = useState(null);
  const [view, setView] = useState(null);
  const [ficheData, setFicheData] = useState(null);

  const perPage = 12;

  // ─────────────────────────────
  // FETCH PROCESSUS
  // ─────────────────────────────
  useEffect(() => {
    const fetchProcessus = async () => {
      console.log("🚀 Fetching processus...");

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

        console.log("📡 Response status:", res.status);

        const data = await res.json();

        console.log("📦 Raw API response:", data);

        const mapped = data.map((p) => ({
          id: p.id,
          name: p.designation,
          category: p.type_processus,
          resp: p.pilote_detail?.full_name || "",
          score: p.score_iso || 0,
          status: p.etat_pr,
          ficheStatus: p.has_fiche ? "deposee" : null,
        }));

        console.log("🔄 Mapped processus:", mapped);

        setProcessus(mapped);

        console.log(" Processus state updated");
      } catch (err) {
        console.error("Error fetching processus:", err);
      }
    };

    fetchProcessus();
  }, []);

  // ─────────────────────────────
  // FILTER LOG
  // ─────────────────────────────
  const filtered = useMemo(() => {
    const result = processus.filter(
      (p) =>
        (filter === "Tous" || p.category === filter) &&
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    console.log("🔍 Filter applied:", {
      search,
      filter,
      resultCount: result.length,
    });

    return result;
  }, [processus, search, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    const result = filtered.slice(start, start + perPage);

    console.log("📄 Pagination:", {
      page,
      perPage,
      showing: result.length,
    });

    return result;
  }, [filtered, page]);

  // ─────────────────────────────
  // CLICK CARD
  // ─────────────────────────────
  const handleCardClick = (process) => {
    console.log("🟦 Card clicked:", process);

    const isRed = process.status === "brouillon" && process.ficheStatus === null;

    console.log("⚠️ isRed check — status:", process.status, "ficheStatus:", process.ficheStatus, "isRed:", isRed);

    if (isRed) {
      console.log("🧭 Opening popup flow");
      setSelectedProcess(process);
      setView("popup");
      return;
    }

    console.log("➡️ Navigating to fiche page");
    navigate("/fiche", {
      state: { process },
    });
  };

  // ─────────────────────────────
  // FICHE FLOW
  // ─────────────────────────────
  const handleUpload = (file) => {
    console.log("📤 File uploaded:", file);

    setFicheData({ type: "upload", fileName: file.name });
    setView("checklist");
  };

  const handleFormComplete = (formData) => {
    console.log("📝 Form completed:", formData);

    setProcessus(prev => prev.map(p =>
      p.id === selectedProcess?.id
        ? { ...p, status: "fiche_deposee", ficheStatus: "deposee" }
        : p
    ));
    setSelectedProcess(prev =>
      prev ? { ...prev, status: "fiche_deposee", ficheStatus: "deposee" } : prev
    );
    setFicheData({ type: "form", ...formData });
    setView("checklist");
  };

  const handleChecklistDone = async (score, accepted) => {
    console.log("📊 Checklist done:", { score, accepted });

    if (selectedProcess) {
      console.log("💾 Saving validation to backend — process:", selectedProcess.id, "score:", score);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/processus/${selectedProcess.id}/valider/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score }),
        });
        const data = await res.json();
        console.log("✅ Validation response:", data);
        setProcessus(prev => prev.map(p =>
          p.id === selectedProcess.id
            ? { ...p, status: data.etat_pr || p.status, ficheStatus: "deposee", score }
            : p
        ));
      } catch (err) {
        console.error("❌ Validation save error:", err);
      }
    }

    setView(null);
    setSelectedProcess(null);
    setFicheData(null);
  };

  // ─────────────────────────────
  // VIEWS
  // ─────────────────────────────
  if (view === "form") {
    console.log("🧾 Rendering form view");

    return (
      <AddProcessForm
        processName={selectedProcess?.name}
        processId={selectedProcess?.id}
        onBack={() => setView("popup")}
        onSave={handleFormComplete}
      />
    );
  }

  if (view === "checklist") {
    console.log("📋 Rendering checklist view");

    return (
      <ISOChecklist
        processName={selectedProcess?.name}
        ficheData={ficheData}
        onDone={handleChecklistDone}
        onBack={() =>
          setView(ficheData?.type === "form" ? "form" : "popup")
        }
      />
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {console.log("🏠 Rendering main page")}

      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">
            Mes processus
          </span>
        </div>
      </header>

      <div className="w-full space-y-6 p-6">
        {/* SEARCH */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={search}
            onChange={(e) => {
              console.log("🔎 Search changed:", e.target.value);
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un processus..."
            className="flex-1 min-w-[200px] px-3 py-2 bg-white border rounded-lg"
          />

          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                console.log("🎯 Filter selected:", t);
                setFilter(t);
                setPage(1);
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((p) => (
            <ProcessCard
              key={p.id}
              process={p}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div>Aucun processus trouvé</div>
        )}
      </div>

      {/* POPUP */}
      {view === "popup" && selectedProcess && (
        <AddFichePopup
          processName={selectedProcess.name}
          onUpload={handleUpload}
          onForm={() => setView("form")}
          onClose={() => {
            console.log("❌ Closing popup");
            setView(null);
            setSelectedProcess(null);
          }}
        />
      )}
    </div>
  );
}
