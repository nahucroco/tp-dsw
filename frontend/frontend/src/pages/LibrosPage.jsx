import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [autorId, setAutorId] = useState("");
  const [editorialId, setEditorialId] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarLibros();
    cargarListas();
  }, []);

  const cargarLibros = async () => {
    // ⚠️ Simulación temporal hasta conectar backend
    setLibros([
      { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Realismo mágico", editorial: "Sudamericana" },
    ]);
  };

  const cargarListas = async () => {
    // ⚠️ Simulaciones
    setAutores([{ id: 1, nombre: "García Márquez" }, { id: 2, nombre: "Borges" }]);
    setEditoriales([{ id: 1, nombre: "Planeta" }, { id: 2, nombre: "Alianza" }]);
    setGeneros([{ id: 1, nombre: "Ficción" }, { id: 2, nombre: "Ensayo" }]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !autorId || !editorialId || !generoId) return;

    const autorNombre = autores.find((a) => a.id === parseInt(autorId))?.nombre;
    const editorialNombre = editoriales.find((e) => e.id === parseInt(editorialId))?.nombre;
    const generoNombre = generos.find((g) => g.id === parseInt(generoId))?.nombre;

    if (editando) {
      setLibros(libros.map((l) =>
        l.id === editando ? { ...l, titulo, autor: autorNombre, editorial: editorialNombre, genero: generoNombre } : l
      ));
      setEditando(null);
    } else {
      const nuevo = {
        id: Date.now(),
        titulo,
        autor: autorNombre,
        editorial: editorialNombre,
        genero: generoNombre,
      };
      setLibros([...libros, nuevo]);
    }

    setTitulo("");
    setAutorId("");
    setEditorialId("");
    setGeneroId("");
  };

  const manejarEliminar = (id) => {
    setLibros(libros.filter((l) => l.id !== id));
  };

  const manejarEditar = (libro) => {
    setTitulo(libro.titulo);
    setAutorId(autores.find((a) => a.nombre === libro.autor)?.id || "");
    setEditorialId(editoriales.find((e) => e.nombre === libro.editorial)?.id || "");
    setGeneroId(generos.find((g) => g.nombre === libro.genero)?.id || "");
    setEditando(libro.id);
  };

  // Ordenar libros por género (alfabéticamente)
  const librosOrdenados = [...libros].sort((a, b) => a.genero.localeCompare(b.genero));

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-4 text-center">Libros</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Título del libro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select className="form-select" value={autorId} onChange={(e) => setAutorId(e.target.value)}>
              <option value="">Autor</option>
              {autores.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" value={editorialId} onChange={(e) => setEditorialId(e.target.value)}>
              <option value="">Editorial</option>
              {editoriales.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" value={generoId} onChange={(e) => setGeneroId(e.target.value)}>
              <option value="">Género</option>
              {generos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabla */}
      <table  className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Editorial</th>
            <th>Género</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {librosOrdenados.map((libro, index) => {
            const mostrarCabecera =
              index === 0 || libro.genero !== librosOrdenados[index - 1].genero;
            return (
              <>
                {mostrarCabecera && (
                  <tr className="table-secondary">
                    <td colSpan="5" className="fw-bold text-center">
                      {libro.genero}
                    </td>
                  </tr>
                )}
                <tr key={libro.id}>
                  <td>{libro.titulo}</td>
                  <td>{libro.autor}</td>
                  <td>{libro.editorial}</td>
                  <td>{libro.genero}</td>
                  <td className="text-end">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => manejarEditar(libro)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => manejarEliminar(libro.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

export default LibrosPage;
