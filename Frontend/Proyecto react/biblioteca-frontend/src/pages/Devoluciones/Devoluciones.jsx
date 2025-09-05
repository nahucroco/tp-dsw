import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Devoluciones() {
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prestamosRes, devolucionesRes] = await Promise.all([
        api.get("/prestamos/activos"),  // Solo los no devueltos
        api.get("/devoluciones"),
      ]);
      setPrestamosActivos(prestamosRes.data);
      setDevoluciones(devolucionesRes.data);
    } catch (error) {
      console.error("Error al cargar devoluciones:", error);
    }
  };

  const devolver = async (prestamoId) => {
    try {
      await api.post(`/devoluciones`, { prestamoId });
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar devolución:", error);
    }
  };

  return (
    <div>
      <h1>🔁 Devoluciones</h1>

      <h2>📦 Préstamos activos</h2>
      {prestamosActivos.length === 0 ? (
        <p>No hay préstamos activos.</p>
      ) : (
        <ul>
          {prestamosActivos.map((p) => (
            <li key={p.id}>
              📖 {p.libroTitulo} prestado a 👤 {p.usuarioNombre} ({p.fecha}){" "}
              <button onClick={() => devolver(p.id)}>Devolver</button>
            </li>
          ))}
        </ul>
      )}

      <h2>📄 Historial de Devoluciones</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Fecha Devolución</th>
          </tr>
        </thead>
        <tbody>
          {devoluciones.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.libroTitulo}</td>
              <td>{d.usuarioNombre}</td>
              <td>{d.fechaDevolucion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
