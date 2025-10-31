import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/autores", label: "Autores" },
  { to: "/editoriales", label: "Editoriales" },
  { to: "/generos", label: "Géneros" },
  { to: "/libros", label: "Libros" },
  { to: "/prestamos", label: "Préstamos" },
  { to: "/personas", label: "Personas" },
];

function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const closeOffcanvas = () => {
    const el = document.getElementById("offcanvasMain");
    if (!el || !window.bootstrap) return;
    const inst =
      window.bootstrap.Offcanvas.getInstance(el) ||
      window.bootstrap.Offcanvas.getOrCreateInstance(el);
    inst?.hide();
  };

  const handleLogout = () => {
    logout();
    closeOffcanvas();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to={isAuth ? "/" : "/login"} onClick={closeOffcanvas}>
          Biblioteca DSW
        </NavLink>

        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasMain"
          aria-controls="offcanvasMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop */}
        <div className="d-none d-lg-flex ms-auto align-items-center gap-3">
          {isAuth && (
            <>
              <ul className="navbar-nav">
                {LINKS.map(l => (
                  <li key={l.to} className="nav-item">
                    <NavLink className="nav-link" to={l.to}>{l.label}</NavLink>
                  </li>
                ))}
              </ul>
              <span className="navbar-text text-light small">Hola, {user?.nombre}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Salir</button>
            </>
          )}
          {!isAuth && (
            <NavLink className="btn btn-primary btn-sm" to="/login">Ingresar</NavLink>
          )}
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div className="offcanvas offcanvas-start text-bg-dark d-lg-none" tabIndex="-1" id="offcanvasMain">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menú</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {isAuth ? (
            <>
              <ul className="navbar-nav mb-3">
                {LINKS.map(l => (
                  <li key={l.to} className="nav-item">
                    <NavLink className="nav-link" to={l.to} onClick={closeOffcanvas}>{l.label}</NavLink>
                  </li>
                ))}
              </ul>
              <div className="d-flex align-items-center justify-content-between">
                <span className="small">Hola, {user?.nombre}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Salir</button>
              </div>
            </>
          ) : (
            <NavLink className="btn btn-primary w-100" to="/login" onClick={closeOffcanvas}>
              Ingresar
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
