import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  async function refresh() {
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      setLoading(true);
      const me = await authApi.me(token);
      setUser(me);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [token]);

  const value = useMemo(() => ({
    token, user, loading,
    isAuthed: Boolean(token && user),
    setToken: (t) => {
      setToken(t);
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    },
    logout: async () => {
      // optional: clear cart at logout (spec says logout clears current cart)
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    },
    refresh
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
