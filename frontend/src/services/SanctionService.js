import api from "../api/axiosConfig";

/**
 * Service thin layer. If backend isn't ready yet, set USE_MOCK=true to persist in localStorage.
 */
const USE_MOCK = false; // <- si todavía no está el endpoint, ponelo en true
const LS_KEY = "mock_sanctions";

function readLS() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {
        return [];
    }
}
function writeLS(rows) {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

export const SanctionService = {
    async listByPerson(personId) {
        if (USE_MOCK) {
            const rows = readLS().filter((s) => s.infractorId === personId);
            // ordenar desc por createdAt
            return rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        const { data } = await api.get(`/sanctions?infractorId=${personId}`);
        return data; // [{id, reason, infractorId, loanId, createdAt, revokedAt?}]
    },
    async create({ personId, loanId, reason }) {
        if (USE_MOCK) {
            const now = new Date().toISOString();
            const rows = readLS();
            const newRow = {
                id: crypto.randomUUID(),
                reason,
                infractorId: personId,
                loanId,
                createdAt: now,
                revokedAt: null,
            };
            rows.push(newRow);
            writeLS(rows);
            return newRow;
        }
        const { data } = await api.post("/sanctions", {
            reason,
            infractorId: personId,
            loanId,
        });
        return data;
    },
    async revoke(id) {
        if (USE_MOCK) {
            const rows = readLS();
            const idx = rows.findIndex((r) => r.id === id);
            if (idx !== -1) rows[idx].revokedAt = new Date().toISOString();
            writeLS(rows);
            return rows[idx];
        }
        const { data } = await api.patch(`/sanctions/${id}/revoke`);
        return data;
    },
};