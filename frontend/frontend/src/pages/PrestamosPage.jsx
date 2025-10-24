import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [libroId, setLibroId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarPrestamos();
    cargarListas();
  }, []);

  const cargarPrestamos = async () => {
    // ⚠️ Simulación temporal hasta conectar backend
    setPrestamos([
      {
        id: 1,
        libro: "Cien años de soledad",
        usuario: "Juan Pérez",
        fechaInicio: "2025-10-01",
        fechaDevolucion: "2025-10-15",
        devuelto: false,
      },
    ]);
  };

  const cargarListas = async () => {
    // ⚠️ Simulaciones temporales
    setLibros([
      { id: 1, titulo: "Cien años de soledad" },
      { id: 2, titulo: "El Aleph" },
    ]);
    setUsuarios([
      { id: 1, nombre: "Juan Pérez" },
      { id: 2, nombre: "María López" },
    ]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!libroId || !usuarioId || !fechaInicio) return;

    const libroTitulo = libros.find((l) => l.id === parseInt(libroId))?.titulo;
    const usuarioNombre = usuarios.find((u) => u.id === parseInt(usuarioId))?.nombre;

    if (editando) {
      setPrestamos(
        prestamos.map((p) =>
          p.id === editando
            ? { ...p, libro: libroTitulo, usuario: usuarioNombre, fechaInicio, fechaDevolucion }
            : p
        )
      );
      setEditando(null);
    } else {
      const nuevo = {
        id: Date.now(),
        libro: libroTitulo,
        usuario: usuarioNombre,
        fechaInicio,
        fechaDevolucion,
        devuelto: false,
      };
      setPrestamos([...prestamos, nuevo]);
    }

    // Limpiar formulario
    setLibroId("");
    setUsuarioId("");
    setFechaInicio("");
    setFechaDevolucion("");
  };

  const manejarEliminar = (id) => {
    setPrestamos(prestamos.filter((p) => p.id !== id));
  };

  const manejarEditar = (prestamo) => {
    setLibroId(libros.find((l) => l.titulo === prestamo.libro)?.id || "");
    setUsuarioId(usuarios.find((u) => u.nombre === prestamo.usuario)?.id || "");
    setFechaInicio(prestamo.fechaInicio);
    setFechaDevolucion(prestamo.fechaDevolucion || "");
    setEditando(prestamo.id);
  };

  // Ordenar préstamos por fecha de inicio (más recientes primero)
  const prestamosOrdenados = [...prestamos].sort(
    (a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)
  );

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-4 text-center">Préstamos</h2>

      {/* Formulario */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={libroId}
              onChange={(e) => setLibroId(e.target.value)}
            >
              <option value="">Libro</option>
              {libros.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            >
              <option value="">Usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              placeholder="Fecha inicio"
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              placeholder="Fecha devolución"
            />
          </div>

          <div className="col-md-2">
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
            <th>Libro</th>
            <th>Usuario</th>
            <th>Inicio</th>
            <th>Devolución</th>
            <th>Devuelto</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamosOrdenados.map((p) => (
            <tr key={p.id}>
              <td>{p.libro}</td>
              <td>{p.usuario}</td>
              <td>{p.fechaInicio}</td>
              <td>{p.fechaDevolucion || "-"}</td>
              <td>{p.devuelto ? "✅" : "❌"}</td>
              <td className="text-end">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => manejarEditar(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
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
  );
}

export default PrestamosPage;
