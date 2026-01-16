import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4242/api",
  timeout: 15_000,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    // You can expand this with toasts, Sentry, etc.
    return Promise.reject(err);
  }
);
