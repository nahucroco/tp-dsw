import { BrowserRouter, Routes, Route } from "react-router-dom";
import Libros from "./pages/Libros/Libros.jsx";
import Usuarios from "./pages/Usuarios/Usuarios";
import Prestamos from "./pages/Prestamos/Prestamos";
import Devoluciones from "./pages/Devoluciones/Devoluciones";
import Home from "./pages/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/devoluciones" element={<Devoluciones />} />
      </Routes>
    </BrowserRouter>
  );
}
