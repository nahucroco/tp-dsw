import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";

/**
 * Estructura del préstamo:
 * {
 *   id: string,
 *   usuarioId: number,
 *   usuarioNombre: string,
 *   libros: Array<{ id:number, titulo:string }>, // 1..3
 *   fechaInicio: 'YYYY-MM-DD',
 *   fechaFin: 'YYYY-MM-DD'
 * }
 *
 * NOTA BACKEND (cuando esté listo):
 * - GET  /users        -> lista de usuarios [{id, name}]
 * - GET  /books        -> lista de libros  [{id, title}]
 * - GET  /loans        -> lista de préstamos
 * - POST /loans        -> crear préstamo
 * - PUT  /loans/:id    -> actualizar préstamo
 * - DELETE /loans/:id  -> eliminar préstamo
 */

const STORAGE_KEY = "prestamos_local";

function PrestamosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  // Form state
  const [usuarioId, setUsuarioId] = useState("");
  const [librosSeleccionados, setLibrosSeleccionados] = useState([]); // ids
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  // ---- Helpers
  const librosMap = useMemo(() => {
    const m = new Map();
    libros.forEach((l) => m.set(String(l.id), l));
    return m;
  }, [libros]);

  const usuarioActual = useMemo(
    () => usuarios.find((u) => String(u.id) === String(usuarioId)),
    [usuarios, usuarioId]
  );

  // ---- Mock loaders (temporal) + LocalStorage
  const cargarUsuarios = async () => {
    try {
      // const res = await api.get("/users");
      // setUsuarios(res.data);
      // MOCK:
      setUsuarios([
        { id: 1, name: "Ana García" },
        { id: 2, name: "Luis Pérez" },
        { id: 3, name: "María López" },
      ]);
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar los usuarios (mock).");
    }
  };

  const cargarLibros = async () => {
    try {
      // const res = await api.get("/books");
      // setLibros(res.data);
      // MOCK:
      setLibros([
        { id: 10, title: "El Quijote" },
        { id: 11, title: "Cien años de soledad" },
        { id: 12, title: "Rayuela" },
        { id: 13, title: "1984" },
        { id: 14, title: "El Principito" },
      ]);
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar los libros (mock).");
    }
  };

  const cargarPrestamosLocal = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setPrestamos(JSON.parse(raw));
    } catch {
      // si hay algo corrupto, lo reseteamos
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const persistirPrestamosLocal = (lista) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([cargarUsuarios(), cargarLibros()]).finally(() => {
      setLoading(false);
      cargarPrestamosLocal();
    });
  }, []);

  // ---- Validaciones
  const validar = () => {
    const err = {};
    if (!usuarioId) err.usuarioId = "Seleccioná un usuario.";
    if (!fechaInicio) err.fechaInicio = "Seleccioná la fecha de inicio.";
    if (!fechaFin) err.fechaFin = "Seleccioná la fecha de fin.";
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      err.fechaFin = "La fecha de fin no puede ser anterior a la de inicio.";
    }
    const unicos = Array.from(new Set(librosSeleccionados));
    if (unicos.length === 0) err.libros = "Seleccioná al menos un libro.";
    if (unicos.length > 3) err.libros = "Máximo 3 libros por préstamo.";
    if (unicos.length !== librosSeleccionados.length) {
      err.libros = "No repitas libros.";
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const limpiarFormulario = () => {
    setUsuarioId("");
    setLibrosSeleccionados([]);
    setFechaInicio("");
    setFechaFin("");
    setEditandoId(null);
    setErrores({});
  };

  // ---- Submit (solo front; localStorage). Cambiar a API cuando esté el backend.
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      id: editandoId ?? crypto.randomUUID(),
      usuarioId: Number(usuarioId),
      usuarioNombre: usuarioActual?.name ?? "",
      libros: librosSeleccionados.map((id) => {
        const l = librosMap.get(String(id));
        return { id: Number(id), titulo: l?.title ?? `Libro ${id}` };
      }),
      fechaInicio,
      fechaFin,
    };

    if (editandoId) {
      // --- FUTURO BACKEND:
      // await api.put(`/loans/${editandoId}`, payload)
      const nuevaLista = prestamos.map((p) => (p.id === editandoId ? payload : p));
      setPrestamos(nuevaLista);
      persistirPrestamosLocal(nuevaLista);
    } else {
      // --- FUTURO BACKEND:
      // const { data } = await api.post("/loans", payload)
      const nuevaLista = [payload, ...prestamos];
      setPrestamos(nuevaLista);
      persistirPrestamosLocal(nuevaLista);
    }

    limpiarFormulario();
  };

  const manejarEditar = (p) => {
    setEditandoId(p.id);
    setUsuarioId(String(p.usuarioId));
    setLibrosSeleccionados(p.libros.map((l) => String(l.id)));
    setFechaInicio(p.fechaInicio);
    setFechaFin(p.fechaFin);
    setErrores({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const manejarEliminar = async (id) => {
    if (!confirm("¿Eliminar el préstamo?")) return;
    // FUTURO BACKEND: await api.delete(`/loans/${id}`)
    const nuevaLista = prestamos.filter((p) => p.id !== id);
    setPrestamos(nuevaLista);
    persistirPrestamosLocal(nuevaLista);
    if (editandoId === id) limpiarFormulario();
  };

  // ---- UI Helpers
  const puedeEnviar = useMemo(() => {
    return (
      usuarioId &&
      fechaInicio &&
      fechaFin &&
      librosSeleccionados.length >= 1 &&
      librosSeleccionados.length <= 3 &&
      new Date(fechaFin) >= new Date(fechaInicio) &&
      new Set(librosSeleccionados).size === librosSeleccionados.length
    );
  }, [usuarioId, fechaInicio, fechaFin, librosSeleccionados]);

  const formClass = (field) => (errores[field] ? "is-invalid" : "");

  const formatFecha = (iso) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString("es-AR");
    } catch {
      return iso;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">{editandoId ? "Editar préstamo" : "Nuevo préstamo"}</h2>
        {loading && (
          <span className="badge bg-secondary">Cargando catálogos…</span>
        )}
      </div>

      <form className="row g-3" onSubmit={manejarSubmit} noValidate>
        {/* Usuario */}
        <div className="col-md-4">
          <label className="form-label">Usuario *</label>
          <select
            className={`form-select ${formClass("usuarioId")}`}
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          >
            <option value="">Seleccionar…</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errores.usuarioId && (
            <div className="invalid-feedback">{errores.usuarioId}</div>
          )}
        </div>

        {/* Libros (multi) */}
        <div className="col-md-8">
          <label className="form-label">
            Libros (1 a 3) *
            <small className="text-muted ms-2">
              {librosSeleccionados.length}/3
            </small>
          </label>
          <select
            multiple
            className={`form-select ${formClass("libros")}`}
            value={librosSeleccionados}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map((o) => o.value);
              // Forzar máximo 3
              if (values.length > 3) {
                // deseleccionar el último que intentó sumar
                values.pop();
              }
              setLibrosSeleccionados(values);
            }}
            size={Math.min(6, Math.max(3, libros.length))}
          >
            {libros.map((l) => (
              <option key={l.id} value={String(l.id)}>
                {l.title}
              </option>
            ))}
          </select>
          {errores.libros && <div className="invalid-feedback d-block">{errores.libros}</div>}
          {/* Chips de previsualización */}
          <div className="mt-2 d-flex flex-wrap gap-2">
            {librosSeleccionados.map((id) => {
              const l = librosMap.get(String(id));
              return (
                <span key={id} className="badge bg-primary">
                  {l?.title ?? `Libro ${id}`}{" "}
                  <button
                    type="button"
                    className="btn btn-sm btn-light ms-1 py-0 px-1"
                    onClick={() =>
                      setLibrosSeleccionados((arr) => arr.filter((x) => x !== id))
                    }
                    title="Quitar"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Fechas */}
        <div className="col-md-3">
          <label className="form-label">Fecha inicio *</label>
          <input
            type="date"
            className={`form-control ${formClass("fechaInicio")}`}
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          {errores.fechaInicio && (
            <div className="invalid-feedback d-block">{errores.fechaInicio}</div>
          )}
        </div>

        <div className="col-md-3">
          <label className="form-label">Fecha fin *</label>
          <input
            type="date"
            className={`form-control ${formClass("fechaFin")}`}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            min={fechaInicio || undefined}
          />
          {errores.fechaFin && (
            <div className="invalid-feedback d-block">{errores.fechaFin}</div>
          )}
        </div>

        {/* Acciones del formulario */}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={!puedeEnviar}>
            {editandoId ? "Guardar cambios" : "Crear préstamo"}
          </button>
          {editandoId && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {/* Listado */}
      <hr className="my-4" />
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3 className="m-0">Préstamos (local)</h3>
        <small className="text-muted">
          *Guardados en localStorage hasta conectar backend
        </small>
      </div>

      {prestamos.length === 0 ? (
        <div className="alert alert-light border">No hay préstamos cargados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Libros</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id}>
                  <td>{p.usuarioNombre}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {p.libros.map((l) => (
                        <span key={l.id} className="badge bg-secondary">
                          {l.titulo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{formatFecha(p.fechaInicio)}</td>
                  <td>{formatFecha(p.fechaFin)}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => manejarEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => manejarEliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PrestamosPage;
