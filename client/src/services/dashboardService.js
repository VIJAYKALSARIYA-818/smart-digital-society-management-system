import api from "@/services/api";

export const fetchDashboardSummary = async () => {
  try {
    return await api.get("/dashboard/summary");
  } catch (error) {
    console.error("Dashboard API error:", error);
    throw error;
  }
};