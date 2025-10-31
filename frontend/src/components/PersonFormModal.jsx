import { useEffect, useState } from "react";
import { PersonService } from "../services/PersonService";

export default function PersonFormModal({ show, onClose, editing }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    setFormError(null);
    setEmailError(null);
    if (editing) {
      // el back devuelve camelCase
      setName(editing.name ?? "");
      setLastName(editing.lastName ?? "");
      setAddress(editing.address ?? "");
      setPhone(editing.phone ?? "");
      setEmailAddress(editing.emailAddress ?? "");
    } else {
      setName("");
      setLastName("");
      setAddress("");
      setPhone("");
      setEmailAddress("");
    }
  }, [editing, show]);

  const disabled =
    !name.trim() || !lastName.trim() || !address.trim() || !phone.trim() || !emailAddress.trim();

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (disabled || submitting) return;

    setSubmitting(true);
    setFormError(null);
    setEmailError(null);

    try {
      const form = {
        name: name.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
      };

      if (editing?.id) {
        await PersonService.update(editing.id, form);
      } else {
        await PersonService.create(form);
      }
      onClose(true);
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.message || data?.error || "No se pudo guardar la persona.";
      if ((data?.field ?? "").toLowerCase() === "emailaddress" || /email/i.test(msg)) {
        setEmailError(msg);
      } else {
        setFormError(msg);
      }
      console.error("Guardar persona error:", data ?? err);
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
            <h5 className="modal-title">{editing ? "Editar persona" : "Nueva persona"}</h5>
            <button type="button" className="btn-close" onClick={() => onClose(false)} />
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {formError && <div className="alert alert-danger mb-3">{formError}</div>}

              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Apellido</label>
                  <input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Dirección</label>
                  <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailError(null);
                      setEmailAddress(e.target.value);
                    }}
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={() => onClose(false)} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={disabled || submitting}>
                {submitting ? "Guardando…" : editing ? "Guardar cambios" : "Crear persona"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
