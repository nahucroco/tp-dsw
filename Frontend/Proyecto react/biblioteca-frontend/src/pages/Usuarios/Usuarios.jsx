import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "" });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {
    setCargando(true);
    api.get("/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setCargando(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/usuarios", nuevoUsuario);
      setNuevoUsuario({ nombre: "", email: "" });
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>

      <h2>👤 Agregar nuevo usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoUsuario.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={nuevoUsuario.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Agregar usuario</button>
      </form>

      <hr />

      <h2>📄 Lista de Usuarios</h2>
      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
