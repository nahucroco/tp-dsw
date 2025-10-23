import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/core';
import { Book } from './Book.js';
import { BusinessEntity } from './BusinessEntity.js';

@Entity()
export class BookCopy extends BusinessEntity {
	@Property({ nullable: false })
	is_available: boolean = true;

	@ManyToOne(() => Book, { nullable: false })
	book!: Rel<Book>;
}
