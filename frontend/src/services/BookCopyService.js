// services/BookCopyService.js
import api from "../api/axiosConfig";

let ENDPOINT = null; // se detecta 1 vez y queda cacheado

async function detectEndpoint() {
  if (ENDPOINT) return ENDPOINT;
  // probamos en silencio y cacheamos el que responda
  try {
    await api.get("/book_copies", { params: { _ping: 1 } });
    ENDPOINT = "/book_copies";
    return ENDPOINT;
  } catch { }
  try {
    await api.get("/book-copies", { params: { _ping: 1 } });
    ENDPOINT = "/book-copies";
    return ENDPOINT;
  } catch { }
  // por si ninguna respondió (evita 404 en consola)
  ENDPOINT = "/book_copies";
  return ENDPOINT;
}

export const BookCopyService = {
  async list() {
    const base = await detectEndpoint();
    const { data } = await api.get(base);
    return Array.isArray(data) ? data : [];
  },

  async create({ bookId, condition = "GOOD", isAvailable = true }) {
    const base = await detectEndpoint();

    // normalización mínima por si el enum del back usa REGULAR en vez de FAIR
    const cond = condition === "FAIR" ? "REGULAR" : condition;

    // intentos compatibles SIN loguear errores (evita ruido en consola)
    const bodies = [
      { id: 0, isAvailable: !!isAvailable, condition: cond, book: { id: Number(bookId) } },
      { isAvailable: !!isAvailable, condition: cond, book: { id: Number(bookId) } },
      { id: 0, is_available: !!isAvailable, condition: cond, book: { id: Number(bookId) } },
      { is_available: !!isAvailable, condition: cond, book: { id: Number(bookId) } },
      { id: 0, isAvailable: !!isAvailable, condition: cond, book: Number(bookId) },
      { id: 0, is_available: !!isAvailable, condition: cond, book: Number(bookId) },
    ];

    let last;
    for (const body of bodies) {
      try {
        const { data } = await api.post(base, body);
        return data;
      } catch (e) {
        last = e;
      }
    }
    // si todo falla, ahora sí mostramos el mensaje real del back
    const msg =
      last?.response?.data?.message ||
      (Array.isArray(last?.response?.data?.issues) && last.response.data.issues.map(i => i.message).join("\n")) ||
      last?.response?.data ||
      "No se pudo crear la copia.";
    throw new Error(msg);
  },

  async remove(id) {
    const base = await detectEndpoint();
    await api.delete(`${base}/${id}`);
  },
};
