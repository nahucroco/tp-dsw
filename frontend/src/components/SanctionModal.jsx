import { useEffect, useMemo, useState } from "react";
import { SanctionService } from "../services/SanctionService";
import { LoanService } from "../services/LoanService";

function normalizeLoan(raw) {
    // Soporta ambos nombres de campos (ES/EN)
    const id = raw.id;
    const start = raw.startDate ?? raw.fechaInicio ?? raw.start_at ?? raw.inicio;
    const end = raw.endDate ?? raw.fechaFin ?? raw.end_at ?? raw.fin;
    const books = raw.books ?? raw.libros ?? raw.bookCopies ?? raw.copias ?? [];
    return {
        id,
        startDate: start ? new Date(start) : null,
        endDate: end ? new Date(end) : null,
        booksCount: Array.isArray(books) ? books.length : Number(books ?? 0),
    };
}

export default function SanctionModal({ show, onClose, person }) {
    const [loans, setLoans] = useState([]);
    const [loanId, setLoanId] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const disabled = !loanId || !reason.trim();

    useEffect(() => {
        if (!person || !show) return;

        // reset al abrir
        setLoanId("");
        setReason("");

        (async () => {
            setLoading(true);
            try {
                const data = await LoanService.getByPerson(person.id);
                const normalized = (data ?? []).map(normalizeLoan);
                setLoans(normalized);
            } catch (e) {
                console.error("Error cargando préstamos por persona:", e);
                setLoans([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [person, show]);

    const onSubmit = async (e) => {
        e?.preventDefault?.();
        if (disabled || !person) return;
        setSubmitting(true);
        try {
            await SanctionService.create({
                personId: person.id,
                loanId: Number(loanId),
                reason: reason.trim(),
            });
            onClose(true); // refresca lista
        } catch (e) {
            console.error("SANCTION CREATE ERROR:", e?.response?.status, e?.response?.data);
            alert(e?.response?.data?.message || "No se pudo crear la sanción.");
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
                        {/* 🔧 usar name/lastName */}
                        <h5 className="modal-title">
                            Sancionar a {person?.name} {person?.lastName}
                        </h5>
                        <button type="button" className="btn-close" onClick={() => onClose(false)} />
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Préstamo asociado</label>

                                {loading ? (
                                    <div className="form-text">Cargando préstamos…</div>
                                ) : loans.length === 0 ? (
                                    <div className="alert alert-info">
                                        Esta persona no tiene préstamos (o no se pudieron cargar).
                                    </div>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={loanId}
                                        onChange={(e) => setLoanId(e.target.value)}
                                    >
                                        <option value="">Seleccioná un préstamo…</option>
                                        {loans.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                #{l.id} •{" "}
                                                {l.startDate ? l.startDate.toLocaleDateString() : "s/fecha"} →{" "}
                                                {l.endDate ? l.endDate.toLocaleDateString() : "s/fecha"} (
                                                {l.booksCount} libro/s)
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <div className="form-text">
                                    La sanción debe vincularse a un préstamo concreto.
                                </div>
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
                                Esta acción marcará a la persona con una sanción activa. Podrás
                                revocarla luego.
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => onClose(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={disabled || submitting || loading || loans.length === 0}
                            >
                                {submitting ? "Guardando…" : "Aplicar sanción"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
