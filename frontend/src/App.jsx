import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import AutoresPage from "./pages/AutoresPage";
import EditorialesPage from "./pages/EditorialesPage";
import GenerosPage from "./pages/GenerosPage";
import LibrosPage from "./pages/LibrosPage";
import PrestamosPage from "./pages/PrestamosPage";
import PersonasPage from "./pages/PersonasPage.jsx";
import RequireAuth from "./routes/RequireAuth";
import "./styles.css";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protegidas */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<LibrosPage />} />
            <Route path="/autores" element={<AutoresPage />} />
            <Route path="/editoriales" element={<EditorialesPage />} />
            <Route path="/generos" element={<GenerosPage />} />
            <Route path="/libros" element={<LibrosPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/personas" element={<PersonasPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
