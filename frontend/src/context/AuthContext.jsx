import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

function avatarKey(userId) {
  return userId ? `avatar:${userId}` : null;
}

function loadAvatar(userId) {
  const key = avatarKey(userId);
  if (!key) return null;
  return localStorage.getItem(key);
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  async function refresh() {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const me = await authApi.me(token);

      // attach avatarUrl from localStorage
      const avatarUrl = loadAvatar(me?.user_id);
      setUser({ ...me, avatarUrl });
    } catch {
      setUser(null);
      setTokenState(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthed: Boolean(token && user),

      setToken: (t) => {
        setTokenState(t);
        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");
      },

      setAvatar: (avatarUrl) => {
        if (!user?.user_id) return;

        const key = avatarKey(user.user_id);
        if (!key) return;

        if (avatarUrl) localStorage.setItem(key, avatarUrl);
        else localStorage.removeItem(key);

        // update UI immediately
        setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
      },

      logout: async () => {
        setTokenState(null);
        setUser(null);
        localStorage.removeItem("token");
      },

      refresh,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
