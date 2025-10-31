import { useEffect, useState } from "react";
import SanctionModal from "../components/SanctionModal";
import PersonFormModal from "../components/PersonFormModal";
import SanctionsListModal from "../components/SanctionsListModal";
import { PersonService } from "../services/PersonService";

export default function PersonasPage() {
  const [personas, setPersonas] = useState([]);

  const [showSanction, setShowSanction] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const [showSanctionsList, setShowSanctionsList] = useState(false);
  const openSanctionsList = (p) => { setSelectedPerson(p); setShowSanctionsList(true); };
  const closeSanctionsList = async (refresh) => {
    setShowSanctionsList(false);
    setSelectedPerson(null);
    if (refresh) await cargarPersonas();
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  async function cargarPersonas() {
    const data = await PersonService.list();
    setPersonas(data);
  }

  const openCreate = () => { setEditingPerson(null); setShowPersonForm(true); };
  const openEdit = (p) => { setEditingPerson(p); setShowPersonForm(true); };
  const closePersonForm = async (refresh) => {
    setShowPersonForm(false);
    setEditingPerson(null);
    if (refresh) await cargarPersonas();
  };

  const openSancionar = (p) => { setSelectedPerson(p); setShowSanction(true); };
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
        <button className="btn btn-primary" onClick={openCreate}>Nueva persona</button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Mail</th>
              <th>Teléfono</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name} {p.lastName}</td>
                <td>{p.emailAddress}</td>
                <td>{p.phone || "-"}</td>
                <td className="text-end">
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openSanctionsList(p)}>
                      Sanciones
                    </button>
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
            ))}
          </tbody>
        </table>
      </div>

      <PersonFormModal show={showPersonForm} onClose={closePersonForm} editing={editingPerson} />
      <SanctionModal show={showSanction} onClose={closeSancionar} person={selectedPerson} />
      <SanctionsListModal show={showSanctionsList} onClose={closeSanctionsList} person={selectedPerson} />
    </div>
  );
}
