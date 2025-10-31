import { useEffect, useState } from "react";
import { SanctionService } from "../services/SanctionService";

export default function SanctionsListModal({ show, onClose, person }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show || !person) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await SanctionService.listByPerson(person.id);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("LIST SANCTIONS ERROR:", e?.response?.status, e?.response?.data);
        setError("No se pudieron cargar las sanciones.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [show, person]);

  const revoke = async (id) => {
    if (!confirm("¿Revocar esta sanción?")) return;
    try {
      setRevokingId(id);
      await SanctionService.revoke(id);
      // refrescar lista
      const data = await SanctionService.listByPerson(person.id);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("No se pudo revocar la sanción.");
    } finally {
      setRevokingId(null);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sanciones de {person?.name} {person?.lastName}</h5>
            <button type="button" className="btn-close" onClick={() => onClose(false)} />
          </div>
          <div className="modal-body">
            {loading && <div className="form-text">Cargando…</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
              items.length === 0 ? (
                <div className="text-secondary">Sin sanciones.</div>
              ) : (
                <ul className="list-group">
                  {items.map(s => (
                    <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-column">
                        <div>
                          <span className={`badge ${s.revokedAt ? "text-bg-secondary" : "text-bg-danger"} me-2`}>
                            {s.revokedAt ? "Revocada" : "Activa"}
                          </span>
                          <strong>#{s.id}</strong>
                        </div>
                        <small className="text-truncate" title={s.reason}>{s.reason}</small>
                        {s.loan && (
                          <small className="text-muted">
                            Préstamo #{s.loan.id} • {s.loan.start_date ?? s.loan.startDate} → {s.loan.end_date ?? s.loan.endDate}
                          </small>
                        )}
                      </div>
                      {!s.revokedAt && (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => revoke(s.id)}
                          disabled={revokingId === s.id}
                        >
                          {revokingId === s.id ? "Revocando…" : "Revocar"}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => onClose(false)}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
