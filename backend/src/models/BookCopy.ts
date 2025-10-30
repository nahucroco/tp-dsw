import { Entity, Enum, ManyToOne, Property, type Rel } from '@mikro-orm/mysql';
import { BookCondition } from '../enums/BookCondition.js';
import { Book } from './Book.js';
import { BusinessEntity } from './BusinessEntity.js';
import { Loan } from './Loan.js';

@Entity()
export class BookCopy extends BusinessEntity {
	@Property({ nullable: false })
	is_available: boolean = true;

	@Enum(() => BookCondition)
	condition!: BookCondition;

	@ManyToOne(() => Book, { nullable: false })
	book!: Rel<Book>;
	@ManyToOne(() => Loan, { nullable: true })
	loan?: Rel<Loan>;
}
