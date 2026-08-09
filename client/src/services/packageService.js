import api from "@/services/api";

export const fetchPackages = (params = {}) => api.get("/packages", { params });

export const fetchPackage = (packageId) => api.get(`/packages/${packageId}`);

export const createPackage = (packageData) => api.post("/packages", packageData);

export const updatePackage = (packageId, packageData) =>
  api.put(`/packages/${packageId}`, packageData);

export const deletePackage = (packageId) => api.delete(`/packages/${packageId}`);