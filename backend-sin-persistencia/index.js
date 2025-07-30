// index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let libros = [
  { id: 1, titulo: "El Principito", autor: "Antoine de Saint-Exupéry" },
  { id: 2, titulo: "1984", autor: "George Orwell" },
];
let nextId = 3;

app.get("/libros", (req, res) => res.json(libros));

app.get("/libros/:id", (req, res) => {
  const libro = libros.find((l) => l.id === parseInt(req.params.id));
  libro ? res.json(libro) : res.status(404).json({ mensaje: "No encontrado" });
});

app.post("/libros", (req, res) => {
  const { titulo, autor } = req.body;
  const nuevo = { id: nextId++, titulo, autor };
  libros.push(nuevo);
  res.status(201).json(nuevo);
});

app.put("/libros/:id", (req, res) => {
  const libro = libros.find((l) => l.id === parseInt(req.params.id));
  if (!libro) return res.status(404).json({ mensaje: "No encontrado" });

  const { titulo, autor } = req.body;
  libro.titulo = titulo;
  libro.autor = autor;
  res.json(libro);
});

app.delete("/libros/:id", (req, res) => {
  const index = libros.findIndex((l) => l.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ mensaje: "No encontrado" });

  const eliminado = libros.splice(index, 1);
  res.json(eliminado[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
