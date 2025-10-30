import api from "../api/axiosConfig";

const base = "/book_copies";

export const BookCopyService = {
  list: () => api.get(base).then(r => r.data),
  create: (payload) => api.post(base, payload).then(r => r.data),
  remove: (id) => api.delete(`${base}/${id}`).then(r => r.data),
};
