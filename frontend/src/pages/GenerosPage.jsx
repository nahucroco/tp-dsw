import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function GenerosPage() {
  const [generos, setGeneros] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarGeneros = async () => {
    setLoading(true);
    try {
      const res = await api.get("/genders");
      setGeneros(res.data); // [{ id, description }]
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar los géneros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const description = descripcion.trim();
    if (!description) return;

    try {
      if (editando) {
        await api.put(`/genders/${editando}`, { id: editando, description });
        setEditando(null);
      } else {
        // ⚠️ Backend exige id > 0 → calculamos el siguiente
        const nextId = generos.length ? Math.max(...generos.map(g => Number(g.id))) + 1 : 1;
        await api.post("/genders", { id: nextId, description });
      }
      setDescripcion("");
      await cargarGeneros();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "No se pudo guardar el género.";
      alert(msg);
    }
  };

  const manejarEliminar = async (id) => {
    if (!confirm("¿Eliminar este género?")) return;
    try {
      await api.delete(`/genders/${id}`);
      await cargarGeneros();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el género.");
    }
  };

  const manejarEditar = (genero) => {
    setDescripcion(genero.description ?? "");
    setEditando(genero.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Géneros</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Descripción del género"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={!descripcion.trim()}>
            {editando ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      {/* Listado */}
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="list-group">
          {generos.map((genero) => (
            <li
              key={genero.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{genero.description}</span>
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
          {!generos.length && <li className="list-group-item text-center">Sin géneros</li>}
        </ul>
      )}
    </div>
  );
}

export default GenerosPage;
