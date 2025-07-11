import { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import { setAccessToken, getAccessToken, clearAccessToken } from "./tokenStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let didTryRefresh = false;
    async function initializeUser() {
      const token = getAccessToken();
      if (token) {
        try {
          const res = await api.get("/user/me");
          setUser(res.data.user);
        } catch (err) {
          console.log("Error fetching user with token:", err.message);
          clearAccessToken();
        } finally {
          setLoading(false);
        }
      } else {
        if (didTryRefresh) {
          setLoading(false);
          return;
        }
        didTryRefresh = true;
        try {
          const pingRes = await fetch(`${import.meta.env.VITE_API_BASE}/ping`);
          const pingText = await pingRes.text();
          console.log("[Auth] Ping response:", pingText);
          await new Promise((r) => setTimeout(r, 300));
        } catch (pingErr) {
          console.warn(
            "[Auth] Ping failed (server might be cold):",
            pingErr.message
          );
        }

        try {
          // refresh token even if accessToken doesn't exist but
          // this else block was especially written to handle the case when
          // on refresh user was redirected to login page again
          // there is refreshToken in the cookie but no access token is there

          console.log("[Auth] No access token. Trying refresh...");
          const res = await api.post("/auth/refresh-token");

          // if response is 204, it means no refresh token exists
          if (res.status === 204) {
            console.warn("[Auth] No refresh token found (204)");
            setUser(null);
            return;
          }

          setAccessToken(res.data.token);

          // fetch user again
          const userRes = await api.get("/user/me");
          setUser(userRes.data.user);
          console.log("[Auth] Auto-login successful.");
        } catch (err) {
          console.log("Auto-login failed:", err.message);
          clearAccessToken();
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    }

    initializeUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (username, email, password) => {
    const res = await api.post("/auth/signup", { username, email, password });
    setAccessToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
