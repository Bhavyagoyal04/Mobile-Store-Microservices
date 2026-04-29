import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, tokenStore } from "./api";

const AuthContext = createContext(null);
const USER_KEY = "msi_user";
const ROLE_KEY = "msi_role";

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

// Decode the "role" claim from a JWT without verifying it (server already did).
function decodeRole(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(decodeURIComponent(escape(json)));
    return claims.role || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // ✅ Eagerly read from localStorage so token is never null on refresh.
  const [token, setToken] = useState(() => tokenStore.get());
  const [username, setUsername] = useState(() => localStorage.getItem(USER_KEY));
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    if (stored) return stored;
    const t = tokenStore.get();
    return t ? decodeRole(t) : null;
  });

  const navigate = useNavigate();

  const login = useCallback(async (u, p) => {
    const res = await authApi.login(u, p);
  
    const token = res.token || res.jwt || res.accessToken || res;
  
    if (!token) {
      throw new Error("Token not found in response");
    }
  
    const r = decodeRole(token);
  
    tokenStore.set(token);
    localStorage.setItem(USER_KEY, u);
  
    if (r) localStorage.setItem(ROLE_KEY, r);
    else localStorage.removeItem(ROLE_KEY);
  
    setToken(token);
    setUsername(u);
    setRole(r);
  }, []);

  const register = useCallback(async (u, p, r = ROLES.ADMIN) => {
    await authApi.register(u, p, r);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setUsername(null);
    setRole(null);
  }, []);

  // ✅ Handle expired / invalid token: clear state and redirect to login.
  useEffect(() => {
    const handleUnauthorized = () => {
      tokenStore.clear();
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ROLE_KEY);
      setToken(null);
      setUsername(null);
      setRole(null);
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      username,
      role,
      isAuthenticated: Boolean(token),
      isAdmin: role === ROLES.ADMIN,
      hasRole: (r) => role === r,
      login,
      register,
      logout,
    }),
    [token, username, role, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}