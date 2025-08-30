// src/controllers/ReservaController.ts

import type { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Reserva } from '../models/Reserva';
import ReservaData from '../data/ReservaData';
import { Book } from '../models/Book'; //Nueva

let currentId = 1;

/* export const getReserva = (req: Request, res: Response) => {
  res.json(ReservaData);
}; */

export const getReserva = async (_req: Request, res: Response) => {
  const em = RequestContext.getEntityManager()!;
  const reservas = await em.find(Reserva, {}, { populate: ['book'] });
  res.json(reservas);
};

/* export const getReservaById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const reserva = ReservaData.find((r) => r.id === id);
  if (!reserva) return res.status(404).json({ message: 'Reserva not found' });
  res.json(reserva);
}; */

export const getReservaById = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager()!;
  const id = Number(req.params.id);
  const reserva = await em.findOne(Reserva, {}, { populate: ['book'] });
  if (!reserva) return res.status(404).json({ message: 'Reserva not found' });
  res.json(reserva);
};

/* export const createReserva = (req: Request, res: Response) => {
  const { libroId, lectorId, fechaReserva, estado } = req.body;
  const newReserva = new Reserva(
    currentId++,
    libroId,
    lectorId,
    fechaReserva,
    estado
  );
  ReservaData.push(newReserva);
  res.status(201).json(newReserva);
}; */

export const createReserva = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager()!;
  const { libroCode, lectorId, fechaReserva, estado } = req.body;

  // Buscar el libro por code (ajustá si preferís por id)
  const book = await em.findOne(Book, { code: Number(libroCode) });
  if (!book) return res.status(400).json({ message: 'Book not found' });

  const reserva = new Reserva(
    book,
    Number(lectorId),
    fechaReserva ? new Date(fechaReserva) : new Date(),
    estado ?? 'PENDIENTE'
  );

  await em.persistAndFlush(reserva);
  res.status(201).json(reserva);
};

/* export const updateReserva = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const reserva = ReservaData.find((r) => r.id === id);
  if (!reserva) return res.status(404).json({ message: 'Reserva not found' });

  const { libroId, lectorId, fechaReserva, estado } = req.body;
  reserva.libroId = libroId;
  reserva.lectorId = lectorId;
  reserva.fechaReserva = fechaReserva;
  reserva.estado = estado;

  res.json(reserva);
}; */

export const updateReserva = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager()!;
  const id = Number(req.params.id);
  const reserva = await em.findOne(Reserva, { id }, { populate: ['book'] });
  if (!reserva) return res.status(404).json({ message: 'Reserva not found' });

  const { libroCode, lectorId, fechaReserva, estado, expiraEn } = req.body;

  if (libroCode !== undefined) {
    const book = await em.findOne(Book, { code: Number(libroCode) });
    if (!book) return res.status(400).json({ message: 'Book not found' });
    reserva.book = book;
  }
  if (lectorId !== undefined) reserva.lectorId = Number(lectorId);
  if (fechaReserva !== undefined) reserva.fechaReserva = new Date(fechaReserva);
  if (estado !== undefined) reserva.estado = estado;
  if (expiraEn !== undefined) reserva.expiraEn = expiraEn ? new Date(expiraEn) : undefined;

  await em.flush();
  res.json(reserva);
};

/* export const deleteReserva = (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const index = ReservaData.findIndex((r) => r.id === id);
  if (index === -1) return res.status(404).json({ message: 'Reserva not found' });

  ReservaData.splice(index, 1);
  res.json({ message: 'Reserva deleted' });
}; */

export const deleteReserva = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager()!;
  const id = Number(req.params.id);
  const reserva = await em.findOne(Reserva, { id });
  if (!reserva) return res.status(404).json({ message: 'Reserva not found' });

  await em.removeAndFlush(reserva);
  res.json({ message: 'Reserva deleted' });
};
