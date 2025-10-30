import {
	Cascade,
	Collection,
	Entity,
	LoadStrategy,
	ManyToOne,
	OneToMany,
	Property,
	type Rel,
} from '@mikro-orm/core';
import { Author } from './Author.js';
import { BookCopy } from './BookCopy.js';
import { BusinessEntity } from './BusinessEntity.js';
import { Gender } from './Gender.js';
import { Publisher } from './Publisher.js';

@Entity()
export class Book extends BusinessEntity {
	@Property()
	title!: string;
	@ManyToOne(() => Gender, { nullable: false })
	gender!: Rel<Gender>;
	@ManyToOne(() => Author, { nullable: false })
	author!: Rel<Author>;
	@ManyToOne(() => Publisher, { nullable: false })
	publisher!: Rel<Publisher>;
	@OneToMany(
		() => BookCopy,
		(copy) => copy.book,
		{
			cascade: [Cascade.PERSIST, Cascade.REMOVE],
			orphanRemoval: true,
			strategy: LoadStrategy.SELECT_IN,
		},
	)
	copies = new Collection<Rel<BookCopy>>(this);
}
