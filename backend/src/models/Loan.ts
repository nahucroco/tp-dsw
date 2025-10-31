import {
	Entity,
	Property,
	ManyToOne,
	Collection,
	OneToMany,
	Cascade,
	LoadStrategy,
	type Rel,
} from '@mikro-orm/core';
import { BusinessEntity } from './BusinessEntity.js';
import { Person } from './Person.js';
import { BookCopy } from './BookCopy.js';

@Entity()
export class Loan extends BusinessEntity {
	@Property()
	startDate!: Date;

	@Property()
	endDate!: Date;

	@ManyToOne(() => Person, { nullable: false })
	person!: Rel<Person>;

	@OneToMany(() => BookCopy, (bc) => bc.loan, { hidden: true })
	bookCopies = new Collection<BookCopy>(this);

	@Property({ persist: false, hidden: true })
	get isFull(): boolean | undefined {
		// si no está inicializada, no la tocamos (evita el 500)
		if (!this.bookCopies.isInitialized()) return undefined;
		return this.bookCopies.getItems().length >= 3;
	}
}
