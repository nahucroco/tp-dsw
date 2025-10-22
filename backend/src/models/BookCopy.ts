import { ManyToOne, Property } from '@mikro-orm/core';
import { Book } from './Book.js';
import { BusinessEntity } from './BusinessEntity.js';

export class BookCopy extends BusinessEntity {
	@Property({ nullable: false })
	is_available: true | false = true;
	@ManyToOne(() => Book, { nullable: false })
	book!: Book;
}
