import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { LoanService } from "../services/LoanService.js";
import { PersonService } from "../services/PersonService.js";
import { BookCopyService } from "../services/BookCopyService.js";

const empty = { start_date: "", end_date: "", personId: "", bookIds: [] };

const ymd = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${m}-${day}`;
};

export default function PrestamosPage() {
  const [loans, setLoans] = useState([]);
  const [persons, setPersons] = useState([]);
  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [L, P, B, C] = await Promise.all([
        LoanService.list(),
        PersonService.list(),
        api.get("/books").then(r => r.data),
        BookCopyService.list(),
      ]);
      setLoans(L);
      setPersons(P);
      setBooks(B);
      setCopies(C);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Copias disponibles por libro (sin loan y, si existe el campo, is_available true)
  const availableByBook = useMemo(() => {
    const m = new Map();
    for (const c of copies) {
      const bId = c.book?.id;
      if (!bId) continue;
      const isFree = !c.loan && (c.is_available ?? true);
      if (!isFree) continue;
      if (!m.has(bId)) m.set(bId, []);
      m.get(bId).push(c);
    }
    return m; // Map<number, BookCopy[]>
  }, [copies]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Toggle de libros (máx. 3, sin repetir)
  const toggleBook = (bookId) => {
    setForm((f) => {
      const has = f.bookIds.includes(bookId);
      if (has) return { ...f, bookIds: f.bookIds.filter(id => id !== bookId) };
      if (f.bookIds.length >= 3) return f;
      return { ...f, bookIds: [...f.bookIds, bookId] };
    });
  };

  const currentLoan = useMemo(
    () => loans.find(l => l.id === editId) || null,
    [loans, editId]
  );

  // Resolver copias libres para los libros seleccionados
  const resolveCopiesForSelectedBooks = () => {
    // mapa: bookId -> copyId actualmente asignada en el préstamo
    const currentByBook = new Map();
    if (currentLoan && Array.isArray(currentLoan.bookCopies)) {
      for (const c of currentLoan.bookCopies) {
        const bId = c.book?.id ?? copies.find(x => x.id === c.id)?.book?.id ?? null;
        if (bId && !currentByBook.has(bId)) currentByBook.set(bId, c.id);
      }
    }

    const selected = new Set(form.bookIds);

    // libros nuevos = seleccionados que antes no estaban
    const toAdd = [...selected].filter(bId => !currentByBook.has(bId));

    // ⚠️ si quitaste libros, por ahora no los mandamos a borrar aquí
    // (si necesitás remover, luego vemos si el back tiene endpoint para “remover copia”)

    // para cada libro nuevo, elegir una copia libre
    const newCopies = [];
    for (const bId of toAdd) {
      const libres = availableByBook.get(bId) || [];
      if (libres.length === 0) {
        const book = books.find(b => b.id === bId);
        throw new Error(`No hay copias disponibles de "${book?.title ?? "Libro " + bId}".`);
      }
      newCopies.push({ id: libres[0].id });
    }

    return newCopies; // 👈 solo las NUEVAS copias que hay que agregar
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { start_date, end_date, personId, bookIds } = form;
    if (!start_date || !end_date || !personId || bookIds.length === 0) {
      return alert("Completá fechas, persona y al menos 1 libro (máx. 3).");
    }

    try {
      const bookCopies = resolveCopiesForSelectedBooks(); // 👈 solo nuevas

      const dStart = new Date(start_date);
      const dEnd = new Date(end_date);

      if (editId) {
        // Envío solo las NUEVAS copias; las actuales el back las mantiene
        const shapes = [
          { id: editId, startDate: dStart, endDate: dEnd, person: { id: Number(personId) }, bookCopies },
          { id: editId, start_date: dStart, end_date: dEnd, person: { id: Number(personId) }, bookCopies },
          { id: editId, startDate: dStart, endDate: dEnd, personId: Number(personId), bookCopies },
        ];

        let lastErr;
        for (const payload of shapes) {
          try { await LoanService.update(editId, payload); lastErr = null; break; }
          catch (e) { console.warn("Intento fallido con payload:", payload, "→", e?.response?.data || e); lastErr = e; }
        }
        if (lastErr) throw lastErr;

        setEditId(null);
      } else {
        // create igual que antes
        const nextId = loans.length ? Math.max(...loans.map(l => l.id)) + 1 : 1;
        await LoanService.create({
          id: nextId,
          start_date: dStart,
          end_date: dEnd,
          person: { id: Number(personId) },
          bookCopies: form.bookIds.map(bId => {
            const libres = availableByBook.get(bId) || [];
            if (!libres.length) throw new Error("No hay copias disponibles de algún libro.");
            return { id: libres[0].id };
          }),
        });
      }

      setForm(empty);
      await load();
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (err instanceof Error && err.message) ||
        (typeof data === "string" && data) ||
        data?.message ||
        (Array.isArray(data?.errors) && data.errors.map(i => i.message || i).join("\n")) ||
        (Array.isArray(data?.issues) && data.issues.map(i => i.message).join("\n")) ||
        data?.error || "No se pudo guardar el préstamo.";
      alert(msg);
    }
  };

  const onEdit = (loan) => {
    // intentamos inferir los libros a partir de las copias pobladas
    const ids =
      (loan.bookCopies || [])
        .map(c => c.book?.id || copies.find(x => x.id === c.id)?.book?.id)
        .filter(Boolean);

    setEditId(loan.id);
    setForm({
      start_date: ymd(loan.startDate || loan.start_date),
      end_date: ymd(loan.endDate || loan.end_date),
      personId: loan.person?.id ?? "",
      bookIds: Array.from(new Set(ids)).slice(0, 3),
    });
  };

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar préstamo?")) return;
    await LoanService.remove(id);
    await load();
  };

  return (
    <div className="col-md-11 mx-auto">
      <h2 className="mb-3 text-center">Préstamos</h2>

      <form onSubmit={onSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Inicio</label>
            <input type="date" className="form-control" name="start_date"
              value={form.start_date} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Fin</label>
            <input type="date" className="form-control" name="end_date"
              value={form.end_date} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Persona</label>
            <select className="form-select" name="personId"
              value={form.personId} onChange={onChange}>
              <option value="">Seleccionar…</option>
              {persons.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.lastName} — {p.emailAddress}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">
              Libros (hasta 3)
            </label>
            <div className="border rounded p-2" style={{ maxHeight: 180, overflowY: "auto" }}>
              {books.map(b => {
                const selected = form.bookIds.includes(b.id);
                const avail = (availableByBook.get(b.id) || []).length;
                const disabled = !selected && (form.bookIds.length >= 3 || avail === 0);
                return (
                  <div className="form-check" key={b.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`book-${b.id}`}
                      checked={selected}
                      disabled={disabled}
                      onChange={() => toggleBook(b.id)}
                    />
                    <label className="form-check-label" htmlFor={`book-${b.id}`}>
                      {b.title} <small className="text-muted">({avail} disp.)</small>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-md-12 mt-2">
            <button className="btn btn-primary" type="submit">
              {editId ? "Actualizar" : "Agregar"}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary ms-2"
                onClick={() => { setEditId(null); setForm(empty); }}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {loading ? <p>Cargando…</p> : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Persona</th>
              <th>Libros</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{ymd(loan.startDate || loan.start_date)}</td>
                <td>{ymd(loan.endDate || loan.end_date)}</td>
                <td>{loan.person ? `${loan.person.name} ${loan.person.lastName}` : "-"}</td>
                <td>
                  {(loan.bookCopies || []).map(c => {
                    const title = c.book?.title
                      || books.find(b => b.id === (copies.find(x => x.id === c.id)?.book?.id))?.title
                      || `Copia #${c.id}`;
                    return <span key={c.id} className="badge bg-secondary me-1">{title}</span>;
                  })}
                </td>
                <td className="text-end">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(loan)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(loan.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
