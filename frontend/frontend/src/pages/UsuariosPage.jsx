import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);

  // --- Cargar usuarios ---
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      // ✅ Cuando el backend esté listo, descomentá esta parte:
      // const res = await api.get("/usuarios");
      // setUsuarios(res.data);

      // ⚠️ Simulación temporal
      setUsuarios([
        { id: 1, nombre: "Juan Pérez", email: "juan@example.com", sancionado: false },
        { id: 2, nombre: "María López", email: "maria@example.com", sancionado: true, motivo: "Retraso en devolución", fechaFin: "2025-11-01" },
        { id: 3, nombre: "Carlos Díaz", email: "carlos@example.com", sancionado: false },
      ]);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  // --- Abrir y cerrar modal ---
  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMotivo("");
    setFechaFin("");
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  // --- Sancionar usuario ---
  const sancionarUsuario = async (e) => {
    e.preventDefault();
    if (!motivo || !fechaFin) return alert("Debes completar todos los campos");

    try {
      // ✅ Cuando el backend esté listo:
      // await api.put(`/usuarios/${usuarioSeleccionado.id}/sancionar`, { motivo, fechaFin });

      // ⚠️ Simulación temporal
      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioSeleccionado.id
            ? { ...u, sancionado: true, motivo, fechaFin }
            : u
        )
      );

      cerrarModal();
    } catch (error) {
      console.error("Error al sancionar usuario:", error);
    }
  };

  // --- Levantar sanción ---
  const levantarSancion = async (id) => {
    try {
      // ✅ Cuando el backend esté listo:
      // await api.put(`/usuarios/${id}/levantar_sancion`);

      // ⚠️ Simulación temporal
      setUsuarios(
        usuarios.map((u) =>
          u.id === id ? { ...u, sancionado: false, motivo: "", fechaFin: "" } : u
        )
      );
    } catch (error) {
      console.error("Error al levantar sanción:", error);
    }
  };

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-4 text-center">Usuarios</h2>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Motivo</th>
            <th>Fin sanción</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                {u.sancionado ? (
                  <span className="badge bg-danger">Sancionado</span>
                ) : (
                  <span className="badge bg-success">Activo</span>
                )}
              </td>
              <td>{u.sancionado ? u.motivo : "-"}</td>
              <td>{u.sancionado ? u.fechaFin : "-"}</td>
              <td className="text-end">
                {!u.sancionado ? (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => abrirModal(u)}
                  >
                    Sancionar
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => levantarSancion(u.id)}
                  >
                    Levantar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Bootstrap */}
      {mostrarModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sancionar usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>
              <form onSubmit={sancionarUsuario}>
                <div className="modal-body">
                  <p>
                    <strong>Usuario:</strong> {usuarioSeleccionado?.nombre}
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Motivo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ej: Devolución fuera de plazo"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha fin sanción</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-danger">
                    Confirmar sanción
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;
