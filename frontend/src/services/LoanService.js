// services/LoanService.js
import api from "../api/axiosConfig";

export const LoanService = {
  // usá el mismo nombre que estás llamando en el modal:
  async getByPerson(personId) {
    // ajustá el endpoint a tu backend real cuando lo tengas
    const { data } = await api.get(`/loans?personId=${personId}`);
    return data; // [{id, fechaInicio, fechaFin, libros: [...] }]
  },
};
