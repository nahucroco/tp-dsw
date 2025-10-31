import { useEffect, useMemo, useState, useCallback } from "react";
import { LoanService } from "../services/LoanService";
import { PersonService } from "../services/PersonService";
import { BookCopyService } from "../services/BookCopyService";

const arr = (x) => (Array.isArray(x) ? x : []);
const getCopyIds = (loan) =>
  arr(loan?.bookCopies ?? loan?.book_copies ?? loan?.copies)
    .map(c => Number(c.id ?? c.copyId))
    .filter(Number.isFinite);

function formatDateISO(d) {
  if (!d) return "";
  const date = new Date(d);
  // yyyy-mm-dd para inputs type="date"
  return date.toISOString().slice(0, 10);
}

function personDisplay(p) {
  if (!p) return "";
  if (p.name) return p.name;
  if (p.full_name) return p.full_name;

  const first = p.firstName ?? p.first_name ?? "";
  const last = p.lastName ?? p.last_name ?? "";
  const full = `${first} ${last}`.trim();
  if (full) return full;

  // últimos recursos útiles para identificar
  if (p.emailAddress ?? p.email) return p.emailAddress ?? p.email;
  if (p.dni) return `DNI ${p.dni}`;
  return `#${p.id}`;
}

function LoanFormModal({ show, onClose, onSaved, editLoan }) {
  const [people, setPeople] = useState([]);
  const [copies, setCopies] = useState([]);

  const [personId, setPersonId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedCopyIds, setSelectedCopyIds] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [unavailableIds, setUnavailableIds] = useState([]);

  const loanCopies = useMemo(() => {
    const arr =
      (editLoan?.bookCopies ??
        editLoan?.book_copies ??
        editLoan?.copies ??
        []);
    return Array.isArray(arr) ? arr : [];
  }, [editLoan]);

  const belongsToThisLoan = useCallback(
    (copyId) => selectedCopyIds.includes(Number(copyId)),
    [selectedCopyIds]
  );

  // Cargar combos
  useEffect(() => {
    if (!show) return;
    (async () => {
      const [ps, cs] = await Promise.all([
        PersonService.list(),
        BookCopyService.list(),
      ]);
      setPeople(ps);
      setCopies(cs);

      // dentro del useEffect que carga combos
      if (editLoan?.id) {
        const fresh = await LoanService.get(Number(editLoan.id)); // 👈 trae copias “populadas”
        setPersonId(fresh.person?.id != null ? String(fresh.person.id) : "");
        setStart(formatDateISO(fresh.startDate ?? fresh.start_date));
        setEnd(formatDateISO(fresh.endDate ?? fresh.end_date));
        setSelectedCopyIds(getCopyIds(fresh));                    // 👈 pre-selecciona
      } else {
        setPersonId("");
        setStart("");
        setEnd("");
        setSelectedCopyIds([]);
      }

      setError(null);
      setUnavailableIds([]);
    })();
  }, [show, editLoan?.id]);

  const isValid = useMemo(() => {
    if (!personId || !start || !end) return false;
    if (new Date(start) > new Date(end)) return false;
    if (selectedCopyIds.length < 1 || selectedCopyIds.length > 3) return false;
    return true;
  }, [personId, start, end, selectedCopyIds]);

  const handleToggleCopy = (id, isAvailable) => {
    // evitar seleccionar copias no disponibles visualmente
    if (!isAvailable) return;
    const n = Number(id);
    setSelectedCopyIds(prev => {
      if (prev.includes(n)) return prev.filter(x => x !== n);
      if (prev.length >= 3) return prev; // máximo 3
      return [...prev, n];
    });
  };

  const toBackendIso = (yyyy_mm_dd) => `${yyyy_mm_dd}T00:00:00.000Z`;
  const originalCopyIds = (editLoan?.bookCopies ?? []).map(c => c.id).sort((a, b) => a - b);

  const sameIds = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSaving(true);
    setError(null);
    setUnavailableIds([]);

    const selected = selectedCopyIds.map(Number);

    const payload = {
      id: editLoan ? Number(editLoan.id) : 0,                 // tu back lo pide así
      start_date: `${start}T00:00:00.000Z`,
      end_date: `${end}T00:00:00.000Z`,
      person: { id: Number(personId) },
      bookCopies: selected.map(id => ({ id })),               // 👈 SIEMPRE enviar
    };

    try {
      if (editLoan) {
        await LoanService.update(editLoan.id, payload);
      } else {
        await LoanService.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      const resp = err?.response;
      if (resp?.status === 400 && resp?.data?.unavailableIds) {
        setUnavailableIds(resp.data.unavailableIds);
        setError("Algunas copias no están disponibles.");
      } else {
        setError(resp?.data?.message || resp?.data?.error || "Error inesperado.");
        console.warn("Error creando/actualizando préstamo:", resp?.data || err);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`modal ${show ? "d-block" : ""}`} tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">{editLoan ? "Editar préstamo" : "Nuevo préstamo"}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                  {unavailableIds.length > 0 && (
                    <div className="mt-1">
                      Copias no disponibles: <strong>{unavailableIds.join(", ")}</strong>
                    </div>
                  )}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Persona</label>
                  <select
                    className="form-select"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {people.map(p => (
                      <option key={p.id} value={String(p.id)}>
                        {personDisplay(p)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Inicio</label>
                  <input type="date" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fin</label>
                  <input type="date" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label m-0">Copias de libros (máx. 3)</label>
                  <small className="text-muted">{selectedCopyIds.length} seleccionadas</small>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-2" style={{ maxHeight: 280, overflowY: "auto" }}>
                  {copies.map(c => {
                    const cid = Number(c.id);
                    const isChecked = selectedCopyIds.includes(cid);
                    const isAvailable = !!c.is_available;
                    const isMine = belongsToThisLoan(c.id);
                    const disabled = !isAvailable && !isMine;

                    return (
                      <div className="col" key={c.id}>
                        <div className={`form-check p-3 border rounded ${!isAvailable && !isMine ? "bg-light" : ""}`}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`copy-${cid}`}
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() => handleToggleCopy(cid, isAvailable || isMine)}
                          />
                          <label className="form-check-label" htmlFor={`copy-${c.id}`}>
                            <div className="fw-semibold">Copia #{c.id}</div>
                            <div className="small text-muted">
                              Libro: {c.book?.title ?? "(sin título)"} — Código: {c.code ?? c.inventory_code ?? "-"}
                            </div>
                            {!isAvailable && !isMine && <span className="badge bg-secondary mt-1">No disponible</span>}
                            {!isAvailable && isMine && <span className="badge bg-info text-dark mt-1">Reservada por este préstamo</span>}
                          </label>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={!isValid || saving}>
                {saving ? "Guardando…" : (editLoan ? "Guardar cambios" : "Crear préstamo")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PrestamosPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await LoanService.list();
      setLoans(data);
    } catch (e) {
      setError("No se pudieron cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = (loan) => {
    setEditing(loan);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este préstamo?")) return;
    try {
      await LoanService.remove(id);
      await load();
    } catch {
      alert("No se pudo eliminar. Intenta nuevamente.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Préstamos</h2>
        <button className="btn btn-primary" onClick={onCreate}>Nuevo préstamo</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-muted">Cargando…</div>
      ) : loans.length === 0 ? (
        <div className="alert alert-info">No hay préstamos.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Persona</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Copias</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {loans.map(l => {
                const start = formatDateISO(l.startDate ?? l.start_date);
                const end = formatDateISO(l.endDate ?? l.end_date);
                const personLabel = personDisplay(l.person);
                return (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{personLabel}</td>
                    <td>{start}</td>
                    <td>{end}</td>
                    <td>
                      {(l.bookCopies ?? []).length ? (
                        <div className="d-flex flex-wrap gap-1">
                          {l.bookCopies.map(c => (
                            <span key={c.id} className="badge text-bg-light border">{c.id}</span>
                          ))}
                        </div>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(l)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(l.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <LoanFormModal
          show={showForm}
          onClose={() => setShowForm(false)}
          onSaved={load}
          editLoan={editing}
        />
      )}
    </div>
  );
}
