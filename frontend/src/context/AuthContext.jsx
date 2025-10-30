import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const AUTH_KEY = "auth_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // {id, nombre, email}

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      setToken(saved);
      // Podés decodificar o pedir perfil. Por ahora mock:
      setUser({ id: 1, nombre: "Admin", email: "admin@demo.com" });
    }
  }, []);

  const login = async ({ email, password }) => {
    // 🔐 MOCK: acepta cualquier cosa no vacía
    if (!email || !password) throw new Error("Credenciales inválidas");
    const fakeToken = "demo-token-" + Date.now();
    localStorage.setItem(AUTH_KEY, fakeToken);
    setToken(fakeToken);
    setUser({ id: 1, nombre: email.split("@")[0], email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout, isAuth: !!token }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
