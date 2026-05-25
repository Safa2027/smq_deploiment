import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  PILOTE: "pilote",
  AUDITEUR: "Auditeur",
  RESPONSABLE: "Responsable métier",
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
 "/user",
  ],
  [ROLES.ADMIN]: [
    "/dashboard", "/processus", "/fiche", "/checklist",
    "/evaluation", "/planaction", "/respo", 
  ],
  [ROLES.PILOTE]: [
    "/dashboard", "/processus", "/fiche", "/checklist",
    "/evaluation", "/planaction", "/respo", 
  ],
  [ROLES.AUDITEUR]: [
    "/dashboard", "/processus", "/fiche", "/checklist", "/planaction","/audit",
  ],
  [ROLES.RESPONSABLE]: [
    "/dashboard", "/processus", "/fiche", "/checklist",
    "/evaluation", 
  ],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const hasAccess = (path) => {
    if (!user) return false;
    const allowed = ROLE_PERMISSIONS[user.role] ?? [];
    return allowed.some((p) => path.startsWith(p));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}