"use client";

// Auth contract (BetterAuth branch): /api/auth/login, /api/auth/logout and
// /api/auth/me are server compatibility shims over BetterAuth (see the
// server's auth.js), so these URLs are intentionally unchanged from the
// old custom-JWT version. The session is now BetterAuth's httpOnly
// "better-auth.session_token" cookie, verified server-side via
// BetterAuth's getSession — not a custom JWT. Login/register password
// rules, toasts, redirects, PrivateRoute reload behaviour, wishlist
// refresh and the theme toggle are all preserved by that contract.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, studioIdOf } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("studiospace-theme");
    const initial = saved === "dark" || saved === "light" ? saved : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("studiospace-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user || data || null);
      return data.user || data || null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const data = await apiFetch("/api/wishlist");
      const list = Array.isArray(data) ? data : data.wishlist || data.items || [];
      setWishlistIds(list.map(studioIdOf).filter(Boolean));
    } catch {
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const current = await refreshUser();
      setLoading(false);
      if (current) await refreshWishlist();
    })();
  }, [refreshUser, refreshWishlist]);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const current = await refreshUser();
    if (current) await refreshWishlist();
    return data;
  }, [refreshUser, refreshWishlist]);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Logout is best-effort; still clear local state below.
    }
    setUser(null);
    setWishlistIds([]);
  }, []);

  const toggleWishlist = useCallback(
    async (studioId) => {
      if (!user) return false;
      const saved = wishlistIds.includes(studioId);
      try {
        if (saved) {
          await apiFetch(`/api/wishlist/${studioId}`, { method: "DELETE" });
          setWishlistIds((ids) => ids.filter((id) => id !== studioId));
          return false;
        }
        await apiFetch("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ studioId }),
        });
        setWishlistIds((ids) => [...ids, studioId]);
        return true;
      } catch (e) {
        throw e;
      }
    },
    [user, wishlistIds]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      theme,
      toggleTheme,
      login,
      logout,
      refreshUser,
      wishlistIds,
      toggleWishlist,
      refreshWishlist,
      isWishlisted: (id) => wishlistIds.includes(id),
    }),
    [user, loading, theme, toggleTheme, login, logout, refreshUser, wishlistIds, toggleWishlist, refreshWishlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
