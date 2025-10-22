import {
	Cascade,
	Collection,
	ManyToOne,
	OneToMany,
	Property,
	type Rel,
} from '@mikro-orm/core';
import { Author } from './Author.js';
import { BookCopy } from './BookCopy.js';
import { BusinessEntity } from './BusinessEntity.js';
import { Gender } from './Gender.js';

export class Book extends BusinessEntity {
	@Property()
	title!: string;
	@ManyToOne(() => Gender, { nullable: false })
	gender!: Rel<Gender>;
	@ManyToOne(() => Author, { nullable: false })
	author!: Author;
	@OneToMany(
		() => BookCopy,
		(copy) => copy.book,
		{
			cascade: [Cascade.PERSIST, Cascade.REMOVE],
			orphanRemoval: true,
		},
	)
	copies = new Collection<BookCopy>(this);
}
