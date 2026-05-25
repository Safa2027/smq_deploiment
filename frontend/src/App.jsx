import "./index.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, ROLE_PERMISSIONS } from "./context/AuthContext";
import Sidebar, { SidebarItem } from "./components/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import { LogIn } from "./pages/login/login";
import { ResetPswd } from "./pages/login/resetpassword";
import ProcessesPage from "./pages/lesprocessus/ProcessesPage";
import FicheProcessus from "./pages/ficheprocessus/ficheprocessus";
import CheckListISO from "./pages/checklistISO/checklist";
import Dashboard from "./pages/dashboard/dashboard";
import ResponsablesProcessus from "./pages/respometier/respometier";
import Evaluation from "./pages/evaluation/evaluation";
import PlanDAction from "./pages/plandaction/plandaction";
import Utilisateurs from "./pages/utilisateurs/utilisateurs";
import Auditeur from "./pages/auditeurplan/auditeur";
import AuditDetail from "./pages/auditeurplan/plan";

import {
  LayoutDashboard, Workflow, FileSpreadsheet, ClipboardCheck,
  ChartColumn, ClipboardList, Users, UserCog, ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, text: "Tableau de bord",          to: "/dashboard"  },
  { icon: <Workflow size={18} />,        text: "Gestion des processus",     to: "/processus"  },
  { icon: <FileSpreadsheet size={18} />, text: "Fiches processus",          to: "/fiche"      },
  { icon: <ClipboardCheck size={18} />,  text: "Checklist ISO",             to: "/checklist"  },
  { icon: <ChartColumn size={18} />,     text: "Évaluation des processus",  to: "/evaluation" },
  { icon: <ClipboardList size={18} />,   text: "Plans d'action",            to: "/planaction" },
  { icon: <Users size={18} />,           text: "Responsables métiers",      to: "/respo"      },
  { icon: <UserCog size={18} />,         text: "Gestion des utilisateurs",  to: "/user"       },
  { icon: <ShieldCheck size={18} />,     text: "Plan d'audit",              to: "/audit"      },
];

function Layout() {
  const { user, logout, hasAccess } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => hasAccess(item.to));

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans">
      <Sidebar user={user?.name} role={user?.role} onLogout={logout}>
        {visibleItems.map((item) => (
          <SidebarItem key={item.to} icon={item.icon} text={item.text} to={item.to} />
        ))}
      </Sidebar>

      <div className="flex-1 overflow-auto bg-[#f5f7fa]">
        <Routes>
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/processus"  element={<ProtectedRoute><ProcessesPage /></ProtectedRoute>} />
          <Route path="/fiche"      element={<ProtectedRoute><FicheProcessus /></ProtectedRoute>} />
          <Route path="/checklist"  element={<ProtectedRoute><CheckListISO /></ProtectedRoute>} />
          <Route path="/respo"      element={<ProtectedRoute><ResponsablesProcessus /></ProtectedRoute>} />
          <Route path="/evaluation" element={<ProtectedRoute><Evaluation /></ProtectedRoute>} />
          <Route path="/planaction" element={<ProtectedRoute><PlanDAction /></ProtectedRoute>} />
          <Route path="/user"       element={<ProtectedRoute><Utilisateurs /></ProtectedRoute>} />
          <Route path="/audit"      element={<ProtectedRoute><Auditeur /></ProtectedRoute>} />
          <Route path="/audits/:id" element={<ProtectedRoute><AuditDetail /></ProtectedRoute>} />
          
          <Route path="*"           element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"   element={<LogIn />} />
        <Route path="/reset-password" element={<ResetPswd />} />
        
        <Route path="/*"  element={<Layout />} />
      </Routes>
    </AuthProvider>
  );
}