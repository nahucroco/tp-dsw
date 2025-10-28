import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Biblioteca DSW</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/autores">Autores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/editoriales">Editoriales</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/generos">Géneros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/libros">Libros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/prestamos">Préstamos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
