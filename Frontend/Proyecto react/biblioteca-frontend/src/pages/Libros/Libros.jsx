export default function Libros() {
  return <h1>Gestión de Libros</h1>;
}
import React from "react";

const librosMock = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: true },
  { id: 2, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", disponible: false },
  { id: 3, titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón", disponible: true },
];

export default function Libros() {
  return (
    <div>
      <h1>Gestión de Libros</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {librosMock.map((libro) => (
            <tr key={libro.id}>
              <td>{libro.id}</td>
              <td>{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>{libro.disponible ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get("/libros")
      .then((response) => {
        setLibros(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar libros:", error);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando libros...</p>;

  return (
    <div>
      <h1>Gestión de Libros</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id}>
              <td>{libro.id}</td>
              <td>{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>{libro.disponible ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Form state
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "",
    autor: "",
    disponible: true,
  });

  useEffect(() => {
    obtenerLibros();
  }, []);

  const obtenerLibros = () => {
    setCargando(true);
    api.get("/libros")
      .then((res) => setLibros(res.data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setCargando(false));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoLibro((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/libros", nuevoLibro);
      setNuevoLibro({ titulo: "", autor: "", disponible: true });
      obtenerLibros(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar libro:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Libros</h1>

      <h2>📘 Agregar nuevo libro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={nuevoLibro.titulo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="autor"
          placeholder="Autor"
          value={nuevoLibro.autor}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="disponible"
            checked={nuevoLibro.disponible}
            onChange={handleChange}
          />
          Disponible
        </label>
        <button type="submit">Agregar libro</button>
      </form>

      <hr />

      <h2>📚 Lista de Libros</h2>
      {cargando ? (
        <p>Cargando libros...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id}>
                <td>{libro.id}</td>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.disponible ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
