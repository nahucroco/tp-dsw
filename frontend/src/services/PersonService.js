// frontend/src/services/PersonService.js
import api from "../api/axiosConfig";

function normalizeArray(payload) {
  if (!payload) return [];
  // casos tipicos: { items: [...] } | { results: [...] } | [...]
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  // a veces viene paginado como { data: { items: [] } }
  if (payload.data) return normalizeArray(payload.data);
  return [];
}

export const PersonService = {
  async list() {
    const { data } = await api.get("/persons"); // ✅ era /people
    return data;
  },

  async create(form) {
    const payload = {
      id: 0, // requerido por el back en POST
      name: (form?.name ?? "").trim(),
      lastName: (form?.lastName ?? "").trim(),
      address: (form?.address ?? "").trim(),
      phone: (form?.phone ?? "").trim(),
      emailAddress: (form?.emailAddress ?? "").trim().toLowerCase(),
    };
    const { data } = await api.post("/persons", payload);
    return data;
  },

  async update(id, form) {
    const payload = {
      id, // requerido por el back en PUT
      name: (form?.name ?? "").trim(),
      lastName: (form?.lastName ?? "").trim(),
      address: (form?.address ?? "").trim(),
      phone: (form?.phone ?? "").trim(),
      emailAddress: (form?.emailAddress ?? "").trim().toLowerCase(),
    };
    await api.put(`/persons/${id}`, payload);
  },

  async remove(id) {
    await api.delete(`/persons/${id}`);
  },
};
