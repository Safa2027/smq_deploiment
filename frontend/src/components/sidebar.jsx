import { Link, useLocation } from "react-router-dom";
import { ChevronLast, ChevronFirst, LogOut } from "lucide-react";
import { useContext, createContext, useState } from "react";
import logo from "../assets/logo.png"
const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  PILOTE: "Pilote",
  AUDITEUR: "Auditeur",
  RESPONSABLE: "Responsable métier",
};

export const SidebarContext = createContext();

export default function Sidebar({ children, user, role, onLogout }) {
  const [expanded, setExpanded] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Initiales pour l'avatar
  const initials = user
    ? user.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside
      className={`h-screen transition-all duration-300 ${
        expanded ? "w-60" : "w-16"
      }`}
      style={{ background: "#2F4157" }}
    >
      <nav className="h-full flex flex-col" style={{ background: "#2F4157" }}>

        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center text-[#9AC7F3]">
          <div className="flex items-center gap-2">
    <img
      src={logo}
      alt="logo"
      className={`overflow-hidden transition-all ml-2 ${expanded ? "w-[40px]" : "w-0"}`}
    />

    {expanded && (
      <span className="font-semibold text-sm whitespace-nowrap text-[#ffffff]">
        SMQ ESI
      </span>
    )}
  </div>
          <button onClick={() => setExpanded((curr) => !curr)}>
            {expanded ? <ChevronLast /> : <ChevronFirst />}
          </button>
        </div>

        {/* Menu */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2 mt-3 space-y-0.5">{children}</ul>
        </SidebarContext.Provider>

        {/* User + Logout */}
        <div
          className="p-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ borderRadius: 8 }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(86,124,142,0.30)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* Avatar */}
            <Link to="/parametre" className="flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-full text-white font-semibold text-xs flex-shrink-0"
                style={{
                  width: 30,
                  height: 30,
                  background: "linear-gradient(135deg, #A2C1D1, #567C8E)",
                }}
              >
                {initials}
              </div>
            </Link>

            {/* Name + role */}
            <div
              className={`overflow-hidden transition-all duration-300 flex-1 ${
                expanded ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              <Link to="/parametre">
                <div className="text-xs font-semibold text-white leading-tight truncate">
                  {user}
                </div>
                <div className="text-xs" style={{ color: "#A2C1D1" }}>
                  {roleLabels[role] || role}
                </div>
              </Link>
            </div>

            {/* Logout icon */}
            {expanded && (
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="flex-shrink-0 transition-colors"
                style={{ color: "#A2C1D1" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C0392B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#A2C1D1")}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2F4157]/40 backdrop-blur-sm"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-80">
            <h3 className="text-base font-semibold" style={{ color: "#2F4157" }}>
              Déconnexion
            </h3>
            <p className="text-sm" style={{ color: "#4A6278" }}>
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  border: "1px solid rgba(47,65,87,0.20)",
                  color: "#2F4157",
                  background: "rgba(47,65,87,0.06)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(47,65,87,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(47,65,87,0.06)")
                }
                onClick={() => setShowLogoutPopup(false)}
              >
                Annuler
              </button>
              <button
                className="py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ background: "#2F4157" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#567C8E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2F4157")
                }
                onClick={() => {
                  setShowLogoutPopup(false);
                  onLogout();
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className="relative flex items-center gap-2 py-2 px-3 my-0.5 rounded-lg text-sm transition-all duration-150 group"
        style={{
          color: active ? "#FFFFFF" : "#A2C1D1",
          fontWeight: active ? 500 : 400,
          background: active ? "rgba(162,193,209,0.18)" : "transparent",
          borderRadius: 8,
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = "rgba(86,124,142,0.30)";
            e.currentTarget.style.color = "#FFFFFF";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#A2C1D1";
          }
        }}
      >
        {/* Active indicator bar */}
        {active && (
          <span
            className="absolute left-0 rounded-r"
            style={{
              top: "20%",
              bottom: "20%",
              width: 2,
              background: "#A2C1D1",
            }}
          />
        )}

        {/* Icon */}
        <span
          style={{
            opacity: active ? 1 : 0.8,
            flexShrink: 0,
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>

        {/* Label */}
        <span
          className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
            expanded ? "w-32 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {text}
        </span>

        {/* Tooltip when collapsed */}
        {!expanded && (
          <div
            className="absolute left-full ml-3 px-3 py-1 rounded-lg text-xs whitespace-nowrap
              invisible opacity-0 -translate-x-2 transition-all duration-200
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
            style={{
              background: "#EEF2F6",
              color: "#2F4157",
              boxShadow: "0 2px 8px rgba(47,65,87,0.15)",
              zIndex: 50,
            }}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
}