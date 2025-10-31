import api from "../api/axiosConfig";

export const PersonService = {
  async list() {
    const { data } = await api.get("/persons");
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/persons", payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/persons/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/persons/${id}`);
    return true;
  },
};