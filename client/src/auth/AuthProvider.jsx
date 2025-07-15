import { createContext, useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { setAccessToken, getAccessToken, clearAccessToken } from "./tokenStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    try{
      const stored= sessionStorage.getItem("chef-user");
      return stored ? JSON.parse(stored) : null;
    } catch{
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const lastPingTimeRef = useRef(0); // Cache ping to avoid duplicates

  const waitForServerWakeup = async (maxAttempts = 5, delayMs = 300) => {
    const now = Date.now();
    if (now - lastPingTimeRef.current < 10_000) return; // Skip if pinged recently
    lastPingTimeRef.current = now;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/ping`, {
          method: "GET",
        });
        if (res.ok) {
          const text = await res.text();
          console.log(`[Auth] Server awake on attempt ${attempt}:`, text);
          return;
        }
      } catch (err) {
        console.log(`[Auth] Ping attempt ${attempt} failed:`, err.message);
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    console.warn("[Auth] Server did not wake up in time.");
  };

  useEffect(() => {
    console.time("[Auth] Initialization");

    const initializeUser = async () => {
      const token = getAccessToken();

      // Case 1: Access token exists — validate it
      if (token) {
        try {
          const res = await api.get("/user/me");
          setUser(res.data.user);
          sessionStorage.setItem("chef-user", JSON.stringify(res.data.user));
        } catch (err) {
          console.log("Error fetching user with token:", err.message);
          clearAccessToken();
          setUser(null);
          sessionStorage.removeItem("chef-user");
        } finally {
          setLoading(false);
          console.timeEnd("[Auth] Initialization");
        }
        return;
      }

      // Case 2: No access token — try refresh
      await waitForServerWakeup();

      try {
        console.log("[Auth] No access token. Trying refresh...");
        const res = await api.post("/auth/refresh-token");

        if (res.status === 204) {
          console.warn("[Auth] No refresh token found (204)");
          setUser(null);
          sessionStorage.removeItem("chef-user");
          return;
        }

        setAccessToken(res.data.token);

        const userRes = await api.get("/user/me");
        setUser(userRes.data.user);
        sessionStorage.setItem("chef-user", JSON.stringify(userRes.data.user));
        console.log("[Auth] Auto-login successful.");
      } catch (err) {
        console.log("Auto-login failed:", err.message);
        clearAccessToken();
        setUser(null);
        sessionStorage.removeItem("chef-user");
      } finally {
        setLoading(false);
        console.timeEnd("[Auth] Initialization");
      }
    };

    initializeUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
    sessionStorage.setItem("chef-user", JSON.stringify(res.data.user));
    return res.data.user;
  };

  const signup = async (username, email, password) => {
    const res = await api.post("/auth/signup", { username, email, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
    sessionStorage.setItem("chef-user", JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    clearAccessToken();
    setUser(null);
    sessionStorage.removeItem("chef-user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
