import { useState, useEffect } from "react";
import NotificationBell from "../notif/NotificationBell";
import { API_URL } from '../../api.js'

import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  X,
  TrendingUp,
  TrendingDown,
  ChevronsUp,
} from "lucide-react";

const statusCfg = {
  conforme:    { label: "Conforme",     bg: "#E1F5EE", color: "#1a7a4a" },
  partiel:     { label: "Partiel",      bg: "#FAEEDA", color: "#a05c00" },
  nonConforme: { label: "Non conforme", bg: "#FCEBEB", color: "#b91c1c" },
};

function barColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function priorityStyle(p) {
  if (p === "Urgente") return "bg-red-50 text-red-700 border-red-200";
  if (p === "Haute") return "bg-orange-50 text-orange-700 border-orange-200";
  if (p === "Moyenne") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function statusStyle(s) {
  if (s === "En retard") return "bg-red-50 text-red-700 border-red-200";
  if (s === "En cours") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "Planifié") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function SvgRadar({ scores, labels }) {
  const [hovered, setHovered] = useState(null);
  const N = labels?.length || 0;
  const CX = 200, CY = 200, R = 155;
  const levels = [25, 50, 75, 100];

  const angle = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;

  const pt = (i, val) => ({
    x: CX + (R * val / 100) * Math.cos(angle(i)),
    y: CY + (R * val / 100) * Math.sin(angle(i)),
  });

  const safeScores = scores || [];
  const dataPoints = safeScores.map((s, i) => pt(i, s));
  const polyline = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const ptColor = (s) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  const labelPt = (i) => {
    const a = angle(i);
    const dist = R + 24;
    return { x: CX + dist * Math.cos(a), y: CY + dist * Math.sin(a) };
  };

  const textAnchor = (i) => {
    if (Math.cos(angle(i)) > 0.1) return "start";
    if (Math.cos(angle(i)) < -0.1) return "end";
    return "middle";
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px]" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.60" />
          <stop offset="35%"  stopColor="#f97316" stopOpacity="0.45" />
          <stop offset="65%"  stopColor="#eab308" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id="dataFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#2F4157" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#567C8E" stopOpacity="0.08" />
        </radialGradient>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={R} fill="url(#radarBg)" />

      {levels.map((lv) => (
        <polygon
          key={lv}
          points={Array.from({ length: N }, (_, i) => {
            const p = pt(i, lv);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.30"
          strokeWidth="1"
        />
      ))}

      {labels.map((_, i) => {
        const end = pt(i, 100);
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={end.x} y2={end.y}
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
        );
      })}

      {levels.map((lv) => (
        <text
          key={lv}
          x={CX + 3}
          y={CY - (R * lv / 100) + 4}
          fontSize="9"
          fill="#94a3b8"
          textAnchor="start"
        >
          {lv}%
        </text>
      ))}

      <polygon
        points={polyline}
        fill="url(#dataFill)"
        stroke="#2F4157"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />

      {dataPoints.map((p, i) => (
        <g
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
          {hovered === i && (
            <circle
              cx={p.x} cy={p.y} r={12}
              fill={ptColor(scores[i])}
              fillOpacity="0.18"
              filter="url(#glowStrong)"
            />
          )}
          <circle
            cx={p.x} cy={p.y}
            r={hovered === i ? 7.5 : 5.5}
            fill={ptColor(scores[i])}
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow)"
            style={{ transition: "r 0.15s ease" }}
          />
        </g>
      ))}

      {hovered !== null && (() => {
        const p = dataPoints[hovered];
        const s = scores[hovered];
        const lbl = labels[hovered];
        const color = ptColor(s);
        const W = 100, H = 36;
        const tx = p.x > 310 ? p.x - W - 4 : p.x < 90 ? p.x + 4 : p.x - W / 2;
        const ty = p.y < 70 ? p.y + 14 : p.y - H - 10;
        return (
          <g style={{ pointerEvents: "none" }}>
            <rect x={tx} y={ty} width={W} height={H} rx={7} fill="#1f2c3d" opacity="0.95" />
            <rect x={tx} y={ty + H - 4} width={W} height={4} rx={3} fill={color} opacity="0.7" />
            <text x={tx + W / 2} y={ty + 13} fontSize="9" fill="#A2C1D1" textAnchor="middle">{lbl}</text>
            <text x={tx + W / 2} y={ty + 27} fontSize="12" fontWeight="bold" fill={color} textAnchor="middle">{s}%</text>
          </g>
        );
      })()}

      {labels.map((lbl, i) => {
        const lp = labelPt(i);
        const ta = textAnchor(i);
        const parts = lbl.split(" - ");
        return (
          <text
            key={i}
            x={lp.x} y={lp.y}
            fontSize="11"
            fontWeight="500"
            fill="#2F4157"
            textAnchor={ta}
            dominantBaseline="middle"
          >
            {parts.length === 2 ? (
              <>
                <tspan x={lp.x} dy="-6" fontWeight="600" fill="#567C8E">{parts[0]}</tspan>
                <tspan x={lp.x} dy="14">{parts[1]}</tspan>
              </>
            ) : lbl}
          </text>
        );
      })}
    </svg>
  );
}

function RadarChart({ clauseScores = [], clauseLabels = [] }){
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
      <div className="flex-1 flex items-center justify-center min-w-0">
        <SvgRadar scores={clauseScores} labels={clauseLabels} />
      </div>

      <div className="flex flex-col gap-3 lg:min-w-[220px] w-full lg:w-auto">
        <p className="text-xs font-semibold text-[#2F4157] uppercase tracking-wider">Échelle de conformité</p>

        <div className="flex flex-col gap-1">
          <div
            className="h-3 rounded-full"
            style={{ background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e)" }}
          />
          <div className="flex justify-between text-[10px] text-[#567C8E]">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          {[
            { color: "#22c55e", bg: "#E1F5EE", label: "Conforme",    range: "≥ 80%" },
            { color: "#f59e0b", bg: "#FAEEDA", label: "Partiel",      range: "60 – 79%" },
            { color: "#ef4444", bg: "#FCEBEB", label: "Non conforme", range: "< 60%" },
          ].map(({ color, bg, label, range }) => (
            <div key={label} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: bg }}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
              <span className="text-[11px] ml-auto" style={{ color }}>{range}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-3 border-t border-[#E2E8F0] flex flex-col gap-1.5">
          <p className="text-xs text-[#567C8E] font-semibold mb-1 uppercase tracking-wider">Clauses ISO 9001</p>
          {clauseLabels.map((label, i) => {
            const s = clauseScores[i];
            const c = barColor(s);
            const bg = s >= 80 ? "#E1F5EE" : s >= 60 ? "#FAEEDA" : "#FCEBEB";
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold w-5 text-center rounded flex-shrink-0"
                  style={{ color: c, background: bg }}
                >
                  {i+1}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s}%`, background: c }} />
                </div>
                <span className="text-[11px] font-bold min-w-[30px] text-right" style={{ color: c }}>{s}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Modal({ title, icon, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <span className="text-[#567C8E]">{icon}</span>
            <span className="text-base font-semibold text-[#2F4157]">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8f8f8] text-[#567C8E] hover:text-[#2F4157] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-1">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendUp, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col gap-3 hover:shadow-lg hover:border-[#A2C1D1] transition-all duration-200 text-left w-full"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? "bg-[#E1F5EE] text-emerald-700" : "bg-[#FCEBEB] text-red-700"}`}>
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-[#2F4157]">{value}</div>
        <div className="text-sm text-[#567C8E] mt-0.5">{label}</div>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#567C8E] group-hover:text-[#2F4157] transition-colors">
        Voir les détails <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

function ConformiteModal({ processes, onClose }) {
  return (
    <Modal title="Conformité globale — Détail par processus" icon={<CheckCircle2 size={18} />} onClose={onClose}>
      <div className="overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f0f4f7]">
              {["Processus", "Type", "Score", "Statut"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[#567C8E] font-medium text-xs border-b border-slate-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => {
              const st = statusCfg[p.statut];
              return (
                <tr key={p.name} className="hover:bg-[#f8fbfd] transition-colors border-b border-[#f0f0f0] last:border-0">
                  <td className="px-3 py-2.5 text-[#2F4157] font-medium">{p.name}</td>
                  <td className="px-3 py-2.5 text-xs text-[#567C8E]">{p.type}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: barColor(p.score) }} />
                      </div>
                      <span className="text-xs font-semibold min-w-[36px] text-right text-[#2F4157]">{p.score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

function ActionsModal({ title, icon, actions, onClose }) {
  return (
    <Modal title={title} icon={icon} onClose={onClose}>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f0f4f7]">
              {["Processus", "Action", "Clause", "Responsable", "Délai", "Priorité", "Statut"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[#567C8E] font-medium text-xs border-b border-slate-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actions.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2.5">
                  <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] whitespace-nowrap">{a.processus}</span>
                </td>
                <td className="px-3 py-2.5 text-[#2F4157] max-w-[200px]">{a.action}</td>
                <td className="px-3 py-2.5 text-[#567C8E] text-xs">{a.clause}</td>
                <td className="px-3 py-2.5 font-medium text-[#2F4157] whitespace-nowrap">{a.responsable}</td>
                <td className="px-3 py-2.5 text-[#567C8E] text-xs whitespace-nowrap">{a.delai}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-1 rounded-md border text-xs font-medium whitespace-nowrap ${priorityStyle(a.priorite)}`}>{a.priorite}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-1 rounded-md border text-xs font-medium whitespace-nowrap ${statusStyle(a.statut)}`}>{a.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://127.0.0.1:8000/api/dashboard/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email: localStorage.getItem("email"),
             role: localStorage.getItem("role"),

          }),
          
        });

        if (!response.ok) {
          console.error("Backend error:", await response.text());
          return;
        }

        const data = await response.json();
        setDashboardData(data);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  console.log("email:", localStorage.getItem("email"));
console.log("role:", localStorage.getItem("role"));
console.log("fetching dashboard data...");
console.log("DASHBOARD DATA:", dashboardData);

  const globalScore = dashboardData?.globalScore ?? 0;
  const urgentActions = dashboardData?.urgentActions ?? [];
  const retardActions = dashboardData?.retardActions ?? [];
  const processes = dashboardData?.processes ?? [];
 const rawClauseScores = dashboardData?.clauseScores ?? [];

// labels extracted from backend
const clauseLabels = rawClauseScores.map(item => item.clause);

// scores aligned automatically
const clauseScores = rawClauseScores.map(item => item.score);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <p className="text-[#567C8E] text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="h-14 flex items-center px-6">
          <span className="text-lg font-medium text-[#2F4157]">Tableau de bord</span>
          <NotificationBell />
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5">
        <div>
          <p className="text-sm text-[#567C8E] mt-0.5">
            Suivi de la progression vers la certification ISO 9001 : École nationale Supérieure d'Informatique
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Conformité globale"
            value={`${globalScore}%`}
            trend="+5% ce mois"
            trendUp={true}
            color="#1a7a4a"
            onClick={() => setModal("conformite")}
          />
          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Tâches urgentes"
            value={urgentActions.length}
            trend="↑ 2 nouvelles"
            trendUp={false}
            color="#b91c1c"
            onClick={() => setModal("urgent")}
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Tâches en retard"
            value={retardActions.length}
            trend="↓ 1 clôturée"
            trendUp={true}
            color="#a05c00"
            onClick={() => setModal("retard")}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] flex flex-col">
          <div className="p-6">
           <RadarChart
  clauseScores={clauseScores}
  clauseLabels={clauseLabels}
/>
          </div>
        </div>
      </div>

      {modal === "conformite" && (
        <ConformiteModal processes={processes} onClose={() => setModal(null)} />
      )}
      {modal === "urgent" && (
        <ActionsModal
          title="Tâches urgentes"
          icon={<AlertTriangle size={18} />}
          actions={urgentActions}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "retard" && (
        <ActionsModal
          title="Tâches en retard"
          icon={<Clock size={18} />}
          actions={retardActions}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}