import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-6 col-lg-4">
        <h2 className="mb-3 text-center">Ingresar</h2>
        <form onSubmit={submit} className="card card-body gap-3">
          <div>
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={email}
                   onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Contraseña</label>
            <input className="form-control" type="password" value={password}
                   onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
