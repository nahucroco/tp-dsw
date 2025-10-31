import { useEffect, useState } from "react";
import SanctionModal from "../components/SanctionModal";
import PersonFormModal from "../components/PersonFormModal";
import { SanctionService } from "../services/SanctionService";
import { PersonService } from "../services/PersonService";

export default function PersonasPage() {
  const [personas, setPersonas] = useState([]);
  const [sanctionsByPerson, setSanctionsByPerson] = useState({});

  const [showSanction, setShowSanction] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    cargarPersonas();
  }, []);

  async function cargarPersonas() {
    const data = await PersonService.list();
    setPersonas(data);
    const pairs = await Promise.all(
      data.map(async (p) => [p.id, await SanctionService.listByPerson(p.id)])
    );
    setSanctionsByPerson(Object.fromEntries(pairs));
  }

  const openCreate = () => {
    setEditingPerson(null);
    setShowPersonForm(true);
  };
  const openEdit = (p) => {
    setEditingPerson(p);
    setShowPersonForm(true);
  };
  const closePersonForm = async (refresh) => {
    setShowPersonForm(false);
    setEditingPerson(null);
    if (refresh) await cargarPersonas();
  };

  const openSancionar = (p) => {
    setSelectedPerson(p);
    setShowSanction(true);
  };
  const closeSancionar = async (refresh) => {
    setShowSanction(false);
    setSelectedPerson(null);
    if (refresh) await cargarPersonas();
  };

  const removePerson = async (p) => {
    if (!confirm(`Eliminar a "${p.name} ${p.lastName}"?`)) return;
    await PersonService.remove(p.id);
    await cargarPersonas();
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Personas</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          Nueva persona
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Mail</th>
              <th>Teléfono</th>
              <th>Sanciones</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p) => {
              const sancs = sanctionsByPerson[p.id] || [];
              const activas = sancs.filter((s) => !s.revokedAt);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.name} {p.lastName}
                    {activas.length > 0 && (
                      <span className="badge text-bg-danger ms-2">
                        {activas.length} activa{activas.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td>{p.emailAddress}</td>
                  <td>{p.phone || "-"}</td>
                  <td>
                    {sancs.length === 0 ? (
                      <span className="text-secondary">—</span>
                    ) : (
                      <div className="d-flex flex-column gap-1">
                        {sancs.slice(0, 2).map((s) => (
                          <div key={s.id} className="d-flex align-items-center gap-2">
                            <span className={`badge ${s.revokedAt ? "text-bg-secondary" : "text-bg-danger"}`}>
                              {s.revokedAt ? "Revocada" : "Activa"}
                            </span>
                            <span className="small text-truncate" style={{ maxWidth: 260 }} title={s.reason}>
                              {s.reason}
                            </span>
                            {!s.revokedAt && (
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={async () => {
                                  await SanctionService.revoke(s.id);
                                  await cargarPersonas();
                                }}
                              >
                                Revocar
                              </button>
                            )}
                          </div>
                        ))}
                        {sancs.length > 2 && <span className="small text-muted">y {sancs.length - 2} más…</span>}
                      </div>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(p)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => openSancionar(p)}>
                        Sancionar
                      </button>
                      <button className="btn btn-sm btn-outline-dark" onClick={() => removePerson(p)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PersonFormModal show={showPersonForm} onClose={closePersonForm} editing={editingPerson} />
      <SanctionModal show={showSanction} onClose={closeSancionar} person={selectedPerson} />
    </div>
  );
}
