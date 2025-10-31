import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function EditorialesPage() {
  const [editoriales, setEditoriales] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  const norm = (e) => ({ id: e.id, name: e.name ?? e.nombre });

  // ------- API (solo /publishers) -------
  const listPublishers = async () => {
    const { data } = await api.get("/publishers");
    return data.map(norm).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  };

  const createPublisher = async (name) => {
    try {
      const { data } = await api.post("/publishers", { name });
      return norm(data);
    } catch (err) {
      // reintento por si el backend exige id
      const reason = err?.response?.data;
      console.error("POST /publishers -> 1er intento falló:", reason);
      const tmpId = Math.floor(Date.now() / 1000);
      const { data } = await api.post("/publishers", { id: tmpId, name });
      return norm(data);
    }
  };

  const updatePublisher = async (id, name) => {
    try {
      const { data } = await api.put(`/publishers/${id}`, { name });
      return norm(data);
    } catch (err) {
      const reason = err?.response?.data;
      console.error("PUT /publishers/:id falló:", reason);
      // reintento incluyendo id en el body si el backend lo pide
      const { data } = await api.put(`/publishers/${id}`, { id, name });
      return norm(data);
    }
  };

  const deletePublisher = async (id) => {
    await api.delete(`/publishers/${id}`);
  };

  // ------- carga inicial -------
  useEffect(() => {
    (async () => {
      setCargando(true);
      try {
        setEditoriales(await listPublishers());
      } catch (e) {
        console.error("GET /publishers falló:", e?.response?.data || e);
        alert("No se pudieron cargar las editoriales (revisá el backend /api/publishers).");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  // ------- acciones -------
  const manejarSubmit = async (e) => {
    e.preventDefault();
    const name = nombre.trim();
    if (!name) return;

    setCargando(true);
    try {
      if (editando) {
        const updated = await updatePublisher(editando, name);
        setEditoriales((prev) =>
          prev.map((it) => (it.id === editando ? updated : it))
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        );
        setEditando(null);
      } else {
        const created = await createPublisher(name);
        setEditoriales((prev) =>
          [...prev, created].sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        );
      }
      setNombre("");
    } catch (e2) {
      console.error("Guardar editorial falló:", e2?.response?.data || e2);
      alert("No se pudo guardar la editorial.");
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminar = async (id) => {
    if (!confirm("¿Eliminar esta editorial?")) return;
    setCargando(true);
    try {
      await deletePublisher(id);
      setEditoriales((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      console.error("DELETE /publishers/:id falló:", e?.response?.data || e);
      alert("No se pudo eliminar la editorial. Verificá que no tenga libros asociados.");
    } finally {
      setCargando(false);
    }
  };

  const manejarEditar = (editorial) => {
    setNombre(editorial.name ?? "");
    setEditando(editorial.id);
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-3 text-center">Editoriales</h2>

      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la editorial"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
          />
          <button className="btn btn-primary" type="submit" disabled={cargando || !nombre.trim()}>
            {editando ? "Actualizar" : "Agregar"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditando(null);
                setNombre("");
              }}
              disabled={cargando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando && !editoriales.length ? (
        <p className="text-muted">Cargando…</p>
      ) : (
        <ul className="list-group">
          {editoriales.map((editorial) => (
            <li
              key={editorial.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{editorial.name}</span>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => manejarEditar(editorial)}
                  disabled={cargando}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => manejarEliminar(editorial.id)}
                  disabled={cargando}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {!editoriales.length && <li className="list-group-item">Sin editoriales.</li>}
        </ul>
      )}
    </div>
  );
}

export default EditorialesPage;
