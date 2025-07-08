import axios from "axios";
import { getAccessToken, setAccessToken } from "../auth/tokenStore";

let isRefreshing = false;
let refreshAndRetryQueue = [];

function processQueue(error, token = null) {
  refreshAndRetryQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  refreshAndRetryQueue = [];
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_LOCAL || "https://chef-gemini.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      if (isRefreshing) {
        // wait for token refresh to complete and retry the request
        return new Promise((resolve, reject) => {
          refreshAndRetryQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token");
        if (res.status === 204) {
          // if no refresh token, then don't retry, return original 401 error
          processQueue(new Error("No refresh token"), null);
          return Promise.reject(error); // original 401
        }
        const newToken = res.data.token;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
