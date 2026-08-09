import api from "@/services/api";

export const fetchSettings = () => api.get("/settings");

export const updateSettings = (settingsData) =>
  api.put("/settings", settingsData);