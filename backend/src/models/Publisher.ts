import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Book } from './Book.js';
import { BusinessEntity } from './BusinessEntity.js';

@Entity()
export class Publisher extends BusinessEntity {
	@Property({ nullable: false })
	name!: string;

	@OneToMany(
		() => Book,
		(book) => book.publisher,
	)
	books = new Collection<Book>(this);
}
