import api from "@/services/api";

export const fetchMaintenanceBills = (params = {}) => api.get("/maintenance-bills", { params });

export const fetchMaintenanceBill = (billId) => api.get(`/maintenance-bills/${billId}`);

export const createMaintenanceBill = (billData) => api.post("/maintenance-bills", billData);

export const updateMaintenanceBill = (billId, billData) => api.put(`/maintenance-bills/${billId}`, billData);

export const deleteMaintenanceBill = (billId) => api.delete(`/maintenance-bills/${billId}`);

export const markMaintenanceBillPaid = (billId, paymentData = {}) => api.post(`/maintenance-bills/${billId}/pay`, paymentData);