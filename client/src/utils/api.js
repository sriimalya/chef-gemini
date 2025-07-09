import axios from "axios";
import { getAccessToken, setAccessToken } from "../auth/tokenStore";

let isRefreshing = false;
let refreshAndRetryQueue = [];

function processQueue(error, token = null) {
  refreshAndRetryQueue.forEach((prom) => {
    if (error) {
      console.warn("[API] Processing queue with error:", error.message);
      prom.reject(error);
    } else {
        console.log("[API] Processing queue with new access token");
        prom.resolve(token);
    }
  });
  refreshAndRetryQueue = [];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, 
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] Request with token to ${config.url}`);
  } else{
    console.log(`[API] Request without token to ${config.url}`);
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors not already retried or refresh-token route
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      if (isRefreshing) {
        console.warn("[API] 401 received for:", originalRequest.url);
        // wait for token refresh to complete and retry the request
        return new Promise((resolve, reject) => {
          refreshAndRetryQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          console.log("[API] Retrying original request with new token");
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("[API] Attempting to refresh access token...");
        const res = await api.post("/auth/refresh-token");
        if (res.status === 204) {
          console.warn("[API] No refresh token available (204)");
          // if no refresh token, then don't retry, return original 401 error
          processQueue(new Error("No refresh token"), null);
          return Promise.reject(error); // original 401
        }
        const newToken = res.data.token;
        console.log("[API] Refresh successful. New token received.");
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log("[API] Retrying original request after refresh...");
        return api(originalRequest);
      } catch (err) {
        console.error("[API] Refresh token request failed:", err.message);
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("[API] Request failed:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
