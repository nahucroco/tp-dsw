import { useEffect, useMemo, useState } from "react";
import { SanctionService } from "../services/SanctionService";
import { LoanService } from "../services/LoanService"; // debe existir: getByPerson(personId)

export default function SanctionModal({ show, onClose, person }) {
    const [loans, setLoans] = useState([]);
    const [loanId, setLoanId] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const disabled = !loanId || !reason.trim();

    useEffect(() => {
        if (!person || !show) return;
        (async () => {
            try {
                const data = await LoanService.getByPerson(person.id);
                setLoans(data);
            } catch (e) {
                console.error(e);
                setLoans([]);
            }
        })();
    }, [person, show]);

    const onSubmit = async (e) => {
        e?.preventDefault?.();
        if (disabled) return;
        setSubmitting(true);
        try {
            await SanctionService.create({ personId: person.id, loanId, reason });
            onClose(true); // true => refrescar
        } catch (e) {
            alert("No se pudo crear la sanción. Revisá la consola.");
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sancionar a {person?.nombre}</h5>
                        <button type="button" className="btn-close" onClick={() => onClose(false)}></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Préstamo asociado</label>
                                <select
                                    className="form-select"
                                    value={loanId}
                                    onChange={(e) => setLoanId(e.target.value)}
                                >
                                    <option value="">Seleccioná un préstamo…</option>
                                    {loans.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            #{l.id} • {new Date(l.fechaInicio).toLocaleDateString()} → {new Date(l.fechaFin).toLocaleDateString()} ({(l.libros?.length || 0)} libro/s)
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text">La sanción debe vincularse a un préstamo concreto.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Motivo</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Ej: Devolución con demora, libro dañado, etc."
                                />
                            </div>

                            <div className="alert alert-warning">
                                Esta acción marcará a la persona con una sanción activa. Podrás revocarla luego.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => onClose(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-danger" disabled={disabled || submitting}>
                                {submitting ? "Guardando…" : "Aplicar sanción"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}