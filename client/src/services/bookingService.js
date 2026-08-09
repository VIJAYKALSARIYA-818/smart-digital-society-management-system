import api from "@/services/api";

export const fetchBookings = (params = {}) => api.get("/bookings", { params });

export const fetchBooking = (bookingId) => api.get(`/bookings/${bookingId}`);

export const createBooking = (bookingData) => api.post("/bookings", bookingData);

export const updateBooking = (bookingId, bookingData) =>
  api.put(`/bookings/${bookingId}`, bookingData);

export const deleteBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);