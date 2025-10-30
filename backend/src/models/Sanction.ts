import { Entity, ManyToOne, Property, type Rel } from '@mikro-orm/core';
import { BusinessEntity } from './BusinessEntity.js';
import { Loan } from './Loan.js';
import { Person } from './Person.js';

@Entity()
export class Sanction extends BusinessEntity {
	@Property({ nullable: false })
	reason!: string;
	@ManyToOne(() => Person, { nullable: false })
	infractor!: Rel<Person>;
	@ManyToOne(() => Loan, { nullable: false })
	loan!: Rel<Loan>;
}
