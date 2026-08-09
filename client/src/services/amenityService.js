import api from "@/services/api";

export const fetchAmenities = (params = {}) => api.get("/amenities", { params });

export const fetchAmenity = (amenityId) => api.get(`/amenities/${amenityId}`);

export const createAmenity = (amenityData) => api.post("/amenities", amenityData);

export const updateAmenity = (amenityId, amenityData) =>
  api.put(`/amenities/${amenityId}`, amenityData);

export const deleteAmenity = (amenityId) => api.delete(`/amenities/${amenityId}`);