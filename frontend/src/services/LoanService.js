import api from "../api/axiosConfig";

export const LoanService = {
  async list() {
    const { data } = await api.get("/loans");
    return [...data].sort(
      (a, b) => new Date(b.startDate ?? b.start_date) - new Date(a.startDate ?? a.start_date)
    );
  },
  async get(id) {
    const { data } = await api.get(`/loans/${id}`);
    return data;
  },

  // CREATE: usa el shape del back
  async create(payload) {
    // payload: { id:0, start_date, end_date, person:{id}, bookCopies:[{id}] }
    const { data } = await api.post("/loans", payload);
    return data;
  },

  // UPDATE: permitimos omitir bookCopies si no cambiaron
  async update(id, payload) {
    await api.put(`/loans/${id}`, payload);
  },

  async remove(id) {
    await api.delete(`/loans/${id}`);
  },
  
  async getByPerson(personId) {
    const { data } = await api.get(`/loans`, { params: { personId } });
    return data;
  },
};
