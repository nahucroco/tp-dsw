import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Prestamos() {
  const [usuarios, setUsuarios] = useState([]);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    usuarioId: "",
    libroId: "",
    fecha: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosRes, librosRes, prestamosRes] = await Promise.all([
        api.get("/usuarios"),
        api.get("/libros"),
        api.get("/prestamos"),
      ]);
      setUsuarios(usuariosRes.data);
      // Filtrar solo libros disponibles
      setLibrosDisponibles(librosRes.data.filter((libro) => libro.disponible));
      setPrestamos(prestamosRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPrestamo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/prestamos", nuevoPrestamo);
      setNuevoPrestamo({ usuarioId: "", libroId: "", fecha: new Date().toISOString().slice(0, 10) });
      cargarDatos();
    } catch (error) {
      console.error("Error al crear préstamo:", error);
    }
  };

  return (
    <div>
      <h1>📦 Préstamos</h1>

      <form onSubmit={handleSubmit}>
        <select name="usuarioId" value={nuevoPrestamo.usuarioId} onChange={handleChange} required>
          <option value="">Seleccionar usuario</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>

        <select name="libroId" value={nuevoPrestamo.libroId} onChange={handleChange} required>
          <option value="">Seleccionar libro</option>
          {librosDisponibles.map((l) => (
            <option key={l.id} value={l.id}>
              {l.titulo}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={nuevoPrestamo.fecha}
          onChange={handleChange}
        />

        <button type="submit">Registrar préstamo</button>
      </form>

      <h2>📋 Lista de Préstamos</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Libro</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.usuarioNombre}</td>
              <td>{p.libroTitulo}</td>
              <td>{p.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
