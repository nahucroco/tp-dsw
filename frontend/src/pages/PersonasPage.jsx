import { useEffect, useState } from "react";
import { PersonService } from "../services/PersonService";

const empty = { name:"", lastName:"", address:"", phone:"", emailAddress:"" };

export default function PersonasPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setList(await PersonService.list()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, lastName, address, phone, emailAddress } = form;
    if (!name || !lastName || !address || !phone || !emailAddress) return;

    try {
      if (editId) {
        await PersonService.update(editId, { id: editId, ...form });
        setEditId(null);
      } else {
        const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
        await PersonService.create({ id: nextId, ...form });
      }
      setForm(empty);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message ?? "No se pudo guardar la persona.");
    }
  };

  const onEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name ?? "",
      lastName: p.lastName ?? "",
      address: p.address ?? "",
      phone: p.phone ?? "",
      emailAddress: p.emailAddress ?? "",
    });
  };

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar persona?")) return;
    await PersonService.remove(id);
    await load();
  };

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-3 text-center">Personas</h2>

      <form onSubmit={onSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" name="name" placeholder="Nombre" value={form.name} onChange={onChange} /></div>
          <div className="col-md-3"><input className="form-control" name="lastName" placeholder="Apellido" value={form.lastName} onChange={onChange} /></div>
          <div className="col-md-3"><input className="form-control" name="emailAddress" placeholder="Email" value={form.emailAddress} onChange={onChange} /></div>
          <div className="col-md-2"><input className="form-control" name="phone" placeholder="Teléfono" value={form.phone} onChange={onChange} /></div>
          <div className="col-md-6 mt-2"><input className="form-control" name="address" placeholder="Dirección" value={form.address} onChange={onChange} /></div>
          <div className="col-md-2 mt-2">
            <button className="btn btn-primary w-100" type="submit">{editId ? "Actualizar" : "Agregar"}</button>
          </div>
        </div>
      </form>

      {loading ? <p>Cargando…</p> : (
        <table className="table table-striped">
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th className="text-end">Acciones</th></tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td>{p.name} {p.lastName}</td>
                <td>{p.emailAddress}</td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td className="text-end">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
