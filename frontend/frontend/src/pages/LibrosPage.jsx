import { useState, useEffect, Fragment } from "react";
import api from "../api/axiosConfig";

function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [autorId, setAutorId] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarLibros = async () => {
    const { data } = await api.get("/books");
    setLibros(data);
  };

  const cargarListas = async () => {
    const [a, g] = await Promise.all([api.get("/authors"), api.get("/genders")]);
    setAutores(a.data);
    setGeneros(g.data);
  };

  useEffect(() => { cargarLibros(); cargarListas(); }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !autorId || !generoId) return;

    const payload = {
      id: editando ?? Math.max(1, (libros.length ? Math.max(...libros.map(l => l.id)) + 1 : 1)),
      title: titulo,
      author: { id: Number(autorId) },
      gender: { id: Number(generoId) },
    };

    if (editando) {
      await api.put(`/books/${editando}`, payload);
      setEditando(null);
    } else {
      await api.post("/books", payload);
    }

    setTitulo(""); setAutorId(""); setGeneroId("");
    await cargarLibros();
  };

  const manejarEliminar = async (id) => {
    await api.delete(`/books/${id}`);
    await cargarLibros();
  };

  const manejarEditar = (libro) => {
    setTitulo(libro.title);
    setAutorId(libro.author?.id ?? "");
    setGeneroId(libro.gender?.id ?? "");
    setEditando(libro.id);
  };

  const librosOrdenados = [...libros].sort((a, b) =>
    (a.gender?.description ?? "").localeCompare(b.gender?.description ?? "")
  );

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-4 text-center">Libros</h2>

      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <input type="text" className="form-control" placeholder="Título del libro"
              value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>

          <div className="col-md-3 col-lg-3">
            <select className="form-select" value={autorId} onChange={(e) => setAutorId(e.target.value)}>
              <option value="">Autor</option>
              {autores.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="col-md-3 col-lg-3">
            <select className="form-select" value={generoId} onChange={(e) => setGeneroId(e.target.value)}>
              <option value="">Género</option>
              {generos.map((g) => <option key={g.id} value={g.id}>{g.description}</option>)}
            </select>
          </div>

          <div className="col-md-12 col-lg-2">
            <button className="btn btn-primary w-100" type="submit">
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr><th>Título</th><th>Autor</th><th>Género</th><th className="text-end">Acciones</th></tr>
        </thead>
        <tbody>
          {librosOrdenados.map((libro, i) => {
            const curr = libro.gender?.description ?? "Sin género";
            const prev = i > 0 ? (librosOrdenados[i - 1].gender?.description ?? "Sin género") : null;
            const header = i === 0 || curr !== prev;

            return (
              <Fragment key={`g-${curr}-${libro.id}`}>
                {header && (
                  <tr className="table-secondary"><td colSpan="4" className="fw-bold text-center">{curr}</td></tr>
                )}
                <tr>
                  <td>{libro.title}</td>
                  <td>{libro.author?.name ?? "-"}</td>
                  <td>{libro.gender?.description ?? "-"}</td>
                  <td className="text-end">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => manejarEditar(libro)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => manejarEliminar(libro.id)}>Eliminar</button>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LibrosPage;
