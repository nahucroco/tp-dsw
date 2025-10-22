import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import AutoresPage from "./pages/AutoresPage";
import EditorialesPage from "./pages/EditorialesPage";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";
import PrestamosPage from "./pages/PrestamosPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/autores" element={<AutoresPage />} />
          <Route path="/editoriales" element={<EditorialesPage />} />
          <Route path="/generos" element={<GenerosPage />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/prestamos" element={<PrestamosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
