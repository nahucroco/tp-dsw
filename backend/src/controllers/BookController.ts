import type { Request, Response } from 'express';
import { Book } from '../models/Book';
import BookData from '../data/BookData';

let currentId = 1;
export const getBook = (req: Request, res: Response) => {
  res.json(BookData);
};

export const getBookById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const book = BookData.find((b) => b.code === id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

export const createBook = (req: Request, res: Response) => {
  const { name, author, gender, is_available } = req.body;
  const newBook = new Book(currentId++, name, author, gender, is_available);
  BookData.push(newBook);
  res.status(201).json(newBook);
};

export const updateBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const book = BookData.find((b) => b.code === id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { name, author, gender, is_available } = req.body;
  book.name = name;
  book.author = author;
  book.gender = gender;
  book.is_available = is_available;

  res.json(book);
};

export const deleteBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const index = BookData.findIndex((b) => b.code === id);
  if (index === -1) return res.status(404).json({ message: 'Book not found' });

  BookData.splice(index, 1);
  res.json({ message: 'Book deleted' });
};
