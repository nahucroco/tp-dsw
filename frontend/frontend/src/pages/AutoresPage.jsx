import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function AutoresPage() {
  const [autores, setAutores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Cargar autores al montar el componente
  useEffect(() => {
    cargarAutores();
  }, []);

  // Simulación temporal sin backend
  const cargarAutores = async () => {
    // ⚠️ Cuando tengan el endpoint real, reemplazá esto por:
    // const res = await api.get("/autores");
    // setAutores(res.data);
    setAutores([
      { id: 1, nombre: "Gabriel García Márquez" },
      { id: 2, nombre: "Jorge Luis Borges" },
    ]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (nombre.trim() === "") return;

    if (editando) {
      // await api.put(`/autores/${editando}`, { nombre });
      setAutores(autores.map((a) => (a.id === editando ? { ...a, nombre } : a)));
      setEditando(null);
    } else {
      // await api.post("/autores", { nombre });
      const nuevoAutor = { id: Date.now(), nombre };
      setAutores([...autores, nuevoAutor]);
    }

    setNombre("");
  };

  const manejarEliminar = async (id) => {
    // await api.delete(`/autores/${id}`);
    setAutores(autores.filter((a) => a.id !== id));
  };

  const manejarEditar = (autor) => {
    setNombre(autor.nombre);
    setEditando(autor.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Autores</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del autor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            {editando ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      {/* Listado */}
      <ul className="list-group">
        {autores.map((autor) => (
          <li
            key={autor.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{autor.nombre}</span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => manejarEditar(autor)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => manejarEliminar(autor.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutoresPage;
