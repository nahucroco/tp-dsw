import type { Request, Response } from "express";
import { BookService } from "../services/BookService";

const bookService = new BookService();
export const getBook = async (req: Request, res: Response) => {
	const books = await bookService.getAll();
	res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const book = await bookService.getById(id);
	if (!book) return res.status(404).json({ message: "Book not found" });
	res.json(book);
};

export const createBook = async (req: Request, res: Response) => {
	// TODO: agregar algun tipo de validacion para que compruebe que se ingrese un libro
	//  (quizas usar la libreria zod)
	const entity = req.body;
	await bookService.create(entity);
	res.status(201).json(entity);
};

export const updateBook = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const entity = req.body;
	if (id !== entity.code) {
		return res.status(400).json({ message: "Id mismatch" });
	}
	const updated = await bookService.update(entity);
	if (!updated) return res.status(404).json({ message: "Book not found" });
	return res.status(204).json(updated);
};

export const deleteBook = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id, 10);
	const deleted = await bookService.delete(id);
	if (!deleted) return res.status(404).json({ message: "Book not found" });
	res.json({ message: "Book deleted" });
};
