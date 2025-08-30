/* class Reserva {
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
    estado: string
  ) {
    this.id = id;
    this.libroId = libroId;
    this.lectorId = lectorId;
    this.fechaReserva = fechaReserva;
    this.estado = estado;
  }
}

export { Reserva };
 */

/// Version para MikroORM (agregado de decoradores)

import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Book } from './Book';

type EstadoReserva = 'PENDIENTE' | 'DISPONIBLE' | 'VENCIDA' | 'CANCELADA';

@Entity()
class Reserva {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Book)
  book!: Book;              

  @Property()
  lectorId!: number;      //Luego reemplazar por relación con entidad Lector  

  @Property()
  fechaReserva!: Date;

  @Property()
  estado!: EstadoReserva;

  @Property({ nullable: true })
  expiraEn?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  constructor(book: Book, lectorId: number, fechaReserva: Date, estado: EstadoReserva) {
    this.book = book;
    this.lectorId = lectorId;
    this.fechaReserva = fechaReserva;
    this.estado = estado;
  }
}
export { Reserva };
export type { EstadoReserva };
