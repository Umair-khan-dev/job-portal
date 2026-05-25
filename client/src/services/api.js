import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  let token = localStorage.getItem("token");
  if (!token && storedUser) {
    try {
      token = JSON.parse(storedUser).token;
      if (token) localStorage.setItem("token", token);
    } catch {
      /* ignore */
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (
      status === 401 &&
      (message === "Invalid token" ||
        message === "Not authorized" ||
        message?.includes("expired"))
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);

/** Build URL for uploaded files (resume, profile image). */
export const fileUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;

  const normalized = filePath.startsWith("/") ? filePath : `/${filePath}`;

  if (import.meta.env.VITE_SERVER_URL) {
    return `${import.meta.env.VITE_SERVER_URL.replace(/\/$/, "")}${normalized}`;
  }

  if (import.meta.env.DEV) {
    return normalized;
  }

  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${normalized}`;
};

export default API;
