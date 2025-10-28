import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Book } from './Book.js';
import { BusinessEntity } from './BusinessEntity.js';

@Entity()
export class Gender extends BusinessEntity {
	@Property({ nullable: false })
	description!: string;
	@OneToMany(
		() => Book,
		(book) => book.gender,
	)
	books = new Collection<Book>(this);
}
