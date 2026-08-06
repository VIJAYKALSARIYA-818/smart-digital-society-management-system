import api from "@/services/api";

export const fetchNotices = (params = {}) => api.get("/notices", { params });

export const fetchNotice = (noticeId) => api.get(`/notices/${noticeId}`);

export const createNotice = (noticeData) => api.post("/notices", noticeData);

export const updateNotice = (noticeId, noticeData) => api.put(`/notices/${noticeId}`, noticeData);

export const deleteNotice = (noticeId) => api.delete(`/notices/${noticeId}`);

export const publishNotice = (noticeId) => api.post(`/notices/${noticeId}/publish`);

export const unpublishNotice = (noticeId) => api.post(`/notices/${noticeId}/unpublish`);