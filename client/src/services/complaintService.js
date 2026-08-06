import api from "@/services/api";

export const fetchComplaints = (params = {}) => api.get("/complaints", { params });

export const fetchComplaint = (complaintId) => api.get(`/complaints/${complaintId}`);

export const createComplaint = (complaintData) => api.post("/complaints", complaintData);

export const updateComplaint = (complaintId, complaintData) =>
  api.put(`/complaints/${complaintId}`, complaintData);

export const deleteComplaint = (complaintId) => api.delete(`/complaints/${complaintId}`);