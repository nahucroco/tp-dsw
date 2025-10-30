import { useEffect, useMemo, useState } from "react";
import { UserService } from "../services/UserService";
import { PersonService } from "../services/PersonService";

const empty = { username: "", password: "", role: "USER", personId: "" };

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [persons, setPersons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const [u, p] = await Promise.all([UserService.list(), PersonService.list()]);
    setUsers(u);
    setPersons(p);
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const personMap = useMemo(() => {
    const m = new Map();
    persons.forEach(p => m.set(p.id, p));
    return m;
  }, [persons]);

  // en UsuariosPage.jsx
  const passOk = (p) =>
    typeof p === "string" &&
    p.length >= 6 &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /[0-9]/.test(p);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role, personId } = form;
    if (!username || !role || !personId) return alert("Completá todos los campos.");

    try {
      if (editId) {
        const payload = {
          id: editId,
          username,
          role,
          person: { id: Number(personId) },
          personId: Number(personId),
        };
        if (password) {
          if (!passOk(password)) return alert("La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número.");
          payload.password = password;
        }
        await UserService.update(editId, payload);
        setEditId(null);
      } else {
        if (!passOk(password)) return alert("La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número.");
        const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        await UserService.create({
          id: nextId,
          username,
          password,
          role,
          person: { id: Number(personId) },
          personId: Number(personId),
        });
      }
      setForm(empty);
      await load();
    } catch (err) {
      console.log("User create/update error:", err?.response?.data);
      const data = err?.response?.data;
      const msg =
        (typeof data === "string" && data) ||
        data?.message ||
        (Array.isArray(data?.issues) && data.issues.map(i => i.message).join("\n")) ||
        data?.error ||
        "No se pudo guardar el usuario.";
      alert(msg);
    }
  };

  const onEdit = (u) => {
    setEditId(u.id);
    setForm({
      username: u.username ?? "",
      password: "",
      role: u.role ?? "USER",
      personId: u.person?.id ?? "",
    });
  };

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await UserService.remove(id);
    await load();
  };

  return (
    <div className="col-md-10 mx-auto">
      <h2 className="mb-3 text-center">Usuarios</h2>

      <form onSubmit={onSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" name="username" placeholder="Username" value={form.username} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="password" name="password" placeholder={editId ? "Nueva contraseña (opcional)" : "Contraseña"} value={form.password} onChange={onChange} />
          </div>
          <div className="col-md-2">
            <select className="form-select" name="role" value={form.role} onChange={onChange}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" name="personId" value={form.personId} onChange={onChange}>
              <option value="">Persona…</option>
              {persons.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.lastName} — {p.emailAddress}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" type="submit">
              {editId ? "OK" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr><th>Username</th><th>Rol</th><th>Persona</th><th>Email</th><th className="text-end">Acciones</th></tr>
        </thead>
        <tbody>
          {users.map(u => {
            const p = u.person ?? personMap.get(u.person?.id);
            return (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{p ? `${p.name} ${p.lastName}` : "-"}</td>
                <td>{p?.emailAddress ?? "-"}</td>
                <td className="text-end">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(u)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
