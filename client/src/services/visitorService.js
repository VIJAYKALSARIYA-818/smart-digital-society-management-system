import api from "@/services/api";

export const fetchVisitors = (params = {}) => api.get("/visitors", { params });

export const fetchVisitor = (visitorId) => api.get(`/visitors/${visitorId}`);

export const createVisitor = (visitorData) => api.post("/visitors", visitorData);

export const updateVisitor = (visitorId, visitorData) =>
  api.put(`/visitors/${visitorId}`, visitorData);

export const deleteVisitor = (visitorId) => api.delete(`/visitors/${visitorId}`);

export const checkInVisitor = (visitorId) => api.post(`/visitors/${visitorId}/check-in`);

export const checkOutVisitor = (visitorId) => api.post(`/visitors/${visitorId}/check-out`);