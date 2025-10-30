import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function AutoresPage() {
  const [autores, setAutores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarAutores = async () => {
    const res = await api.get("/authors");
    setAutores(res.data);
  };

  useEffect(() => { cargarAutores(); }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const name = nombre.trim();
    if (!name) return;

    try {
      if (editando) {
        // UPDATE: el back pide id en body y lo compara con :id
        await api.put(`/authors/${editando}`, { id: editando, name });
        setEditando(null);
      } else {
        // CREATE: el back hoy exige id > 0 ⇒ calculamos el siguiente
        const nextId = autores.length ? Math.max(...autores.map(a => a.id)) + 1 : 1;
        await api.post("/authors", { id: nextId, name });
      }
      setNombre("");
      await cargarAutores();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "No se pudo guardar el autor.";
      alert(msg);
    }
  };



  const manejarEliminar = async (id) => {
    await api.delete(`/authors/${id}`);
    await cargarAutores();
  };

  const manejarEditar = (autor) => {
    setNombre(autor.name);
    setEditando(autor.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Autores</h2>

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

      <ul className="list-group">
        {autores.map((a) => (
          <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{a.name}</span>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => manejarEditar(a)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => manejarEliminar(a.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default AutoresPage;
