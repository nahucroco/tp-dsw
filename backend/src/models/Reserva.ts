class Reserva {
	id: number;
	libroId: number;
	lectorId: number;
	fechaReserva: string;
	estado: string;

	constructor(
		id: number,
		libroId: number,
		lectorId: number,
		fechaReserva: string,
		estado: string,
	) {
		this.id = id;
		this.libroId = libroId;
		this.lectorId = lectorId;
		this.fechaReserva = fechaReserva;
		this.estado = estado;
	}
}

export { Reserva };
