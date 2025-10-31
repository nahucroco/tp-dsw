import {
	Cascade,
	Entity,
	OneToOne,
	Property,
	type Rel,
	Unique,
} from '@mikro-orm/core';
import { BusinessEntity } from './BusinessEntity.js';
import { Person } from './Person.js';

@Entity()
export class User extends BusinessEntity {
	@Property({ nullable: false })
	@Unique()
	username!: string;
	@Property({ nullable: false })
	password!: string;
	@Property({ nullable: false })
	role!: string;
	@Unique({ name: 'unique_user_person' })
	@OneToOne(() => Person, { nullable: false, cascade: [Cascade.PERSIST] })
	person!: Rel<Person>;
}
