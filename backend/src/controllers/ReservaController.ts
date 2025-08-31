import type { Request, Response } from "express";
import ReservaData from "../data/ReservaData";
import { Reserva } from "../models/Reserva";

let currentId = 1;

export const getReserva = (req: Request, res: Response) => {
	res.json(ReservaData);
};

export const getReservaById = (req: Request, res: Response) => {
	const id = parseInt(req.params.id!);
	const reserva = ReservaData.find((r) => r.id === id);
	if (!reserva) return res.status(404).json({ message: "Reserva not found" });
	res.json(reserva);
};

export const createReserva = (req: Request, res: Response) => {
	const { libroId, lectorId, fechaReserva, estado } = req.body;
	const newReserva = new Reserva(
		currentId++,
		libroId,
		lectorId,
		fechaReserva,
		estado,
	);
	ReservaData.push(newReserva);
	res.status(201).json(newReserva);
};

export const updateReserva = (req: Request, res: Response) => {
	const id = parseInt(req.params.id!);
	const reserva = ReservaData.find((r) => r.id === id);
	if (!reserva) return res.status(404).json({ message: "Reserva not found" });

	const { libroId, lectorId, fechaReserva, estado } = req.body;
	reserva.libroId = libroId;
	reserva.lectorId = lectorId;
	reserva.fechaReserva = fechaReserva;
	reserva.estado = estado;

	res.json(reserva);
};

export const deleteReserva = (req: Request, res: Response) => {
	const id = parseInt(req.params.id!);
	const index = ReservaData.findIndex((r) => r.id === id);
	if (index === -1)
		return res.status(404).json({ message: "Reserva not found" });

	ReservaData.splice(index, 1);
	res.json({ message: "Reserva deleted" });
};
