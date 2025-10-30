// src/pages/SancionesPage.jsx
import { useEffect, useState } from "react";

// fallback simple en localStorage para probar
const KEY = "sanciones";
const load = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

export default function SancionesPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // si no hay nada, cargo un ejemplo
    const data = load();
    if (!data.length) {
      const demo = [
        { id: 1, userId: 1, motivo: "Retraso en devolución", desde: "2025-10-01", hasta: "2025-10-15", permanente: false, activa: true },
      ];
      save(demo);
      setRows(demo);
    } else {
      setRows(data);
    }
  }, []);

  const levantar = (id) => {
    const data = load().map(s => s.id === id ? { ...s, activa: false } : s);
    save(data);
    setRows(data);
  };

  return (
    <div>
      <h2 className="mb-3">Sanciones</h2>
      {!rows.length && <p className="text-muted">Sin sanciones.</p>}
      {!!rows.length && (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>#Usuario</th>
              <th>Motivo</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.id}>
                <td>{s.userId}</td>
                <td>{s.motivo}</td>
                <td>{s.permanente ? "Permanente" : `${s.desde} → ${s.hasta}`}</td>
                <td>{s.activa ? <span className="badge bg-danger">Activa</span> : <span className="badge bg-secondary">Levantada</span>}</td>
                <td className="text-end">
                  {s.activa && (
                    <button className="btn btn-sm btn-outline-success" onClick={() => levantar(s.id)}>
                      Levantar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
