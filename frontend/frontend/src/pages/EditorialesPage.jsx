import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function EditorialesPage() {
  const [editoriales, setEditoriales] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Cargar autores al montar el componente
  useEffect(() => {
    cargarEditoriales();
  }, []);

  // Simulación temporal sin backend
  const cargarEditoriales = async () => {
    // ⚠️ Cuando tengan el endpoint real, reemplazá esto por:
    // const res = await api.get("/autores");
    // setEditoriales(res.data);
    setEditoriales([
      { id: 1, nombre: "Planeta" },
      { id: 2, nombre: "Alianza" },
    ]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (nombre.trim() === "") return;

    if (editando) {
      // await api.put(`/editoriales/${editando}`, { nombre });
      setEditoriales(editoriales.map((a) => (a.id === editando ? { ...a, nombre } : a)));
      setEditando(null);
    } else {
      // await api.post("/editoriales", { nombre });
      const nuevaEditorial = { id: Date.now(), nombre };
      setEditoriales([...editoriales, nuevaEditorial]);
    }

    setNombre("");
  };

  const manejarEliminar = async (id) => {
    // await api.delete(`/editoriales/${id}`);
    setEditoriales(editoriales.filter((a) => a.id !== id));
  };

  const manejarEditar = (editorial) => {
    setNombre(editorial.nombre);
    setEditando(editorial.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Editoriales</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la editorial"
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
        {editoriales.map((editorial) => (
          <li
            key={editorial.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{editorial.nombre}</span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => manejarEditar(editorial)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => manejarEliminar(editorial.id)}
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

export default EditorialesPage;
