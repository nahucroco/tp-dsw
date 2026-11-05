import {
	Cascade,
	Entity,
	OneToOne,
	Property,
	type Rel,
	Unique,
} from '@mikro-orm/core';
import { Enum } from '@mikro-orm/mysql';
import { UserRole } from '../enums/UserRole.js';
import { BusinessEntity } from './BusinessEntity.js';
import { Person } from './Person.js';

@Entity()
export class User extends BusinessEntity {
	@Property({ nullable: false })
	@Unique()
	username!: string;
	@Property({ nullable: false, hidden: true })
	password!: string;
	@Enum(() => UserRole)
	role!: UserRole;
	@Unique({ name: 'unique_user_person' })
	@OneToOne(() => Person, { nullable: false, cascade: [Cascade.PERSIST] })
	person!: Rel<Person>;
}
