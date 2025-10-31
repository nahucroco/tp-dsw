import api from "../api/axiosConfig";

export const SanctionService = {
  async listByPerson(personId) {
    try {
      // 1) Traigo todo y filtro en front
      const { data } = await api.get("/sanctions");
      const all = Array.isArray(data) ? data : [];

      // 2) Filtro por infractor.id (tolerante a null/undefined)
      const filtered = all.filter(s => Number(s?.infractor?.id) === Number(personId));

      // 3) Proyección con tolerancia de campos (snake/camel)
      return filtered.map(s => ({
        id: s.id,
        reason: s.reason,
        revokedAt: s.revokedAt ?? null, // no existe en el back actual, queda por compat
        loan: s.loan
          ? {
              id: s.loan.id,
              start_date: s.loan.start_date ?? s.loan.startDate ?? null,
              end_date: s.loan.end_date ?? s.loan.endDate ?? null,
            }
          : null,
        infractor: s.infractor ?? null,
      }));
    } catch (e) {
      console.error("LIST SANCTIONS ERROR:", e?.response?.status, e?.response?.data);
      return [];
    }
  },

  async create({ personId, loanId, reason }) {
    // El back actual valida id (entregamos 0 para pasar Zod)
    const payload = {
      id: 0,
      reason: String(reason).trim(),
      infractor: { id: Number(personId) },
      loan: { id: Number(loanId) },
    };
    const { data } = await api.post("/sanctions", payload);
    return data;
  },

  // "revocar" ≈ eliminar, porque el back no tiene /:id/revoke ni revokedAt
  async revoke(id) {
    const { data } = await api.delete(`/sanctions/${id}`);
    return data; // algunos back devuelven 204 sin body; manejalo en el caller
  },
};
