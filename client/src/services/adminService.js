import api from "@/services/api";

export const fetchUsers = (params = {}) => api.get("/admin/users", { params });

export const fetchUser = (userId) => api.get(`/admin/users/${userId}`);

export const createUser = (userData) => api.post("/admin/users", userData);

export const updateUser = (userId, userData) =>
  api.put(`/admin/users/${userId}`, userData);

export const updateUserRole = (userId, role) =>
  api.put(`/admin/users/${userId}/role`, { role });

export const updateUserStatus = (userId, isActive) =>
  api.put(`/admin/users/${userId}/status`, { isActive });

export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

export const fetchRoles = () => api.get("/admin/roles");