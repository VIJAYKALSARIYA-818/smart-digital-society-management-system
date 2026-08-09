import api from "@/services/api";

export const fetchParkingSlots = (params = {}) =>
  api.get("/parking", { params });

export const fetchParkingSlot = (parkingId) =>
  api.get(`/parking/${parkingId}`);

export const createParkingSlot = (parkingData) =>
  api.post("/parking", parkingData);

export const updateParkingSlot = (parkingId, parkingData) =>
  api.put(`/parking/${parkingId}`, parkingData);

export const deleteParkingSlot = (parkingId) =>
  api.delete(`/parking/${parkingId}`);