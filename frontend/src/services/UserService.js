import api from "../api/axiosConfig";

const base = "/users";

export const UserService = {
  list: () => api.get(base).then(r => r.data),
  get: (id) => api.get(`${base}/${id}`).then(r => r.data),
  create: (payload) => api.post(base, payload).then(r => r.data),
  update: (id, payload) => api.put(`${base}/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`${base}/${id}`).then(r => r.data),
};
