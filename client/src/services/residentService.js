import api from "@/services/api";

export const fetchResidents = (params = {}) => api.get("/residents", { params });

export const fetchResident = (residentId) => api.get(`/residents/${residentId}`);

export const createResident = (residentData) => api.post("/residents", residentData);

export const updateResident = (residentId, residentData) =>
	api.put(`/residents/${residentId}`, residentData);

export const deleteResident = (residentId) => api.delete(`/residents/${residentId}`);
