import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function GenerosPage() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Cargar autores al montar el componente
  useEffect(() => {
    cargarGeneros();
  }, []);

  // Simulación temporal sin backend
  const cargarGeneros = async () => {
    // ⚠️ Cuando tengan el endpoint real, reemplazá esto por:
    // const res = await api.get("/autores");
    // setGeneros(res.data);
    setGeneros([
      { id: 1, nombre: "Ciencia ficción" },
      { id: 2, nombre: "Terror" },
    ]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (nombre.trim() === "") return;

    if (editando) {
      // await api.put(`/generos/${editando}`, { nombre });
      setGeneros(generos.map((a) => (a.id === editando ? { ...a, nombre } : a)));
      setEditando(null);
    } else {
      // await api.post("/generos", { nombre });
      const nuevoGenero = { id: Date.now(), nombre };
      setGeneros([...generos, nuevoGenero]);
    }

    setNombre("");
  };

  const manejarEliminar = async (id) => {
    // await api.delete(`/generos/${id}`);
    setGeneros(generos.filter((a) => a.id !== id));
  };

  const manejarEditar = (genero) => {
    setNombre(genero.nombre);
    setEditando(genero.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Generos</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la genero"
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
        {generos.map((genero) => (
          <li
            key={genero.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{genero.nombre}</span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => manejarEditar(genero)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => manejarEliminar(genero.id)}
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

export default GenerosPage;
