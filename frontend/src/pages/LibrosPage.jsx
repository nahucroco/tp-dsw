import { useState, useEffect, useMemo, Fragment } from "react";
import api from "../api/axiosConfig";
import { BookCopyService } from "../services/BookCopyService.js";

function LibrosPage() {
  // ---- estado ----
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [copias, setCopias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);

  // form de libro
  const [titulo, setTitulo] = useState("");
  const [autorId, setAutorId] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [editorialId, setEditorialId] = useState("");
  const [editando, setEditando] = useState(null);

  // condición por libro para crear nuevas copias (GOOD/NEW/FAIR/DAMAGED)
  const [condiciones, setCondiciones] = useState({}); // { [bookId]: "GOOD" }
  const getCond = (bookId) => condiciones[bookId] || "GOOD";
  const setCond = (bookId, val) =>
    setCondiciones((prev) => ({ ...prev, [bookId]: val }));

  // ---- loaders ----
  const cargarLibros = async () => {
    const { data } = await api.get("/books");
    setLibros(data);
  };

  const cargarListas = async () => {
    const fetchOr = async (paths) => {
      let lastErr;
      for (const p of paths) {
        try {
          return (await api.get(p)).data;
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
    };

    try {
      const autoresData = await fetchOr(["/authors", "/autores"]);
      setAutores(autoresData);

      // En tu back la entidad es Gender
      const generosData = await fetchOr(["/genders", "/genres", "/generos"]);
      setGeneros(generosData);

      // Publisher / Editorial
      const editorialesData = await fetchOr(["/publishers", "/editoriales"]);
      setEditoriales(editorialesData);
    } catch (e) {
      console.error("Error cargando listas:", e?.response?.data || e);
      alert("No se pudieron cargar autores/géneros/editoriales. Verificá endpoints.");
    }
  };

  const cargarCopias = async () => {
    const data = await BookCopyService.list();
    setCopias(data);
  };

  useEffect(() => {
    cargarLibros();
    cargarListas();
    cargarCopias();
  }, []);

  // ---- stats copias por libro ----
  const statsPorLibro = useMemo(() => {
    const m = new Map();
    for (const c of copias) {
      const bookId = c.book?.id;
      if (!bookId) continue;
      const cur = m.get(bookId) || { total: 0, libres: 0 };
      cur.total += 1;
      if (!c.loan && (c.is_available ?? true)) cur.libres += 1;
      m.set(bookId, cur);
    }
    return m;
  }, [copias]);

  // ---- CRUD libros ----
  const limpiarForm = () => {
    setTitulo("");
    setAutorId("");
    setGeneroId("");
    setEditorialId("");
    setEditando(null);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !autorId || !generoId) return;

    const payload = {
      title: titulo,
      author: { id: Number(autorId) },
      gender: { id: Number(generoId) }, // tu back usa "gender"
      publisher: editorialId ? { id: Number(editorialId) } : null,
    };

    if (editando) {
      await api.put(`/books/${editando}`, payload);
    } else {
      await api.post("/books", payload);
    }

    limpiarForm();
    await cargarLibros();
  };

  const manejarEliminar = async (id) => {
    await api.delete(`/books/${id}`);
    await cargarLibros();
    await cargarCopias(); // por si se borran en cascada
  };

  const manejarEditar = (libro) => {
    setTitulo(libro.title);
    setAutorId(libro.author?.id ?? "");
    setGeneroId(libro.gender?.id ?? "");
    setEditorialId(libro.publisher?.id ?? "");
    setEditando(libro.id);
  };

  // ---- Gestor de copias (+ / −) ----
  const agregarCopia = async (bookId) => {
    try {
      const nextId = copias.length ? Math.max(...copias.map((c) => c.id)) + 1 : 1;
      await BookCopyService.create({
        id: nextId,
        is_available: true,
        condition: getCond(bookId),
        book: { id: Number(bookId) },
      });
      await cargarCopias();
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (typeof data === "string" && data) ||
        data?.message ||
        (Array.isArray(data?.issues) && data.issues.map((i) => i.message).join("\n")) ||
        data?.error ||
        "No se pudo crear la copia.";
      alert(msg);
    }
  };

  const quitarCopia = async (bookId) => {
    try {
      const candidates = copias.filter((c) => c.book?.id === bookId && !c.loan);
      if (candidates.length === 0) {
        return alert("No podés quitar: todas las copias de este libro están prestadas.");
      }
      await BookCopyService.remove(candidates[0].id);
      await cargarCopias();
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (typeof data === "string" && data) ||
        data?.message ||
        (Array.isArray(data?.issues) && data.issues.map((i) => i.message).join("\n")) ||
        data?.error ||
        "No se pudo quitar la copia.";
      alert(msg);
    }
  };

  const librosOrdenados = [...libros].sort((a, b) =>
    (a.gender?.description ?? "").localeCompare(b.gender?.description ?? "")
  );

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-4 text-center">Libros</h2>

      {/* Form libro */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Título del libro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="col-md-3 col-lg-3">
            <select className="form-select" value={autorId} onChange={(e) => setAutorId(e.target.value)}>
              <option value="">Autor</option>
              {autores.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name ?? a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 col-lg-3">
            <select className="form-select" value={generoId} onChange={(e) => setGeneroId(e.target.value)}>
              <option value="">Género</option>
              {generos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.description ?? g.descripcion ?? g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 col-lg-3">
            <select className="form-select" value={editorialId} onChange={(e) => setEditorialId(e.target.value)}>
              <option value="">Editorial</option>
              {editoriales.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.name ?? ed.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12 col-lg-2">
            <button className="btn btn-primary w-100" type="submit">
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabla */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>Editorial</th>
            <th style={{ width: 300 }}>Copias</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {librosOrdenados.map((libro, i) => {
            const curr = libro.gender?.description ?? "Sin género";
            const prev = i > 0 ? librosOrdenados[i - 1].gender?.description ?? "Sin género" : null;
            const header = i === 0 || curr !== prev;

            const st = statsPorLibro.get(libro.id) || { total: 0, libres: 0 };

            return (
              <Fragment key={`g-${curr}-${libro.id}`}>
                {header && (
                  <tr className="table-secondary">
                    <td colSpan="6" className="fw-bold text-center">
                      {curr}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>{libro.title}</td>
                  <td>{libro.author?.name ?? "-"}</td>
                  <td>{libro.gender?.description ?? "-"}</td>
                  <td>{libro.publisher?.name ?? libro.editorial?.nombre ?? "-"}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span>
                        {st.total}{" "}
                        <small className="text-muted">({st.libres} libres)</small>
                      </span>

                      {/* condición para nuevas copias */}
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 140 }}
                        value={getCond(libro.id)}
                        onChange={(e) => setCond(libro.id, e.target.value)}
                      >
                        <option value="GOOD">GOOD</option>
                        <option value="NEW">NEW</option>
                        <option value="FAIR">FAIR</option>
                        <option value="DAMAGED">DAMAGED</option>
                      </select>

                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => quitarCopia(libro.id)}
                          title="Quitar una copia libre"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => agregarCopia(libro.id)}
                          title="Agregar una copia con la condición seleccionada"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => manejarEditar(libro)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => manejarEliminar(libro.id)}>
                      Eliminar
                    </button>
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
