import api from "@/services/api";

export const loginUser = (credentials) => api.post("/auth/login", credentials);

export const registerUser = (userData) => api.post("/auth/register", userData);

export const fetchCurrentUser = () => api.get("/auth/me");

export const logoutUser = () => api.post("/auth/logout");
