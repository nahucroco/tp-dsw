import { Entity, Property, Unique } from '@mikro-orm/core';
import { BusinessEntity } from './BusinessEntity.js';

@Entity()
export class Person extends BusinessEntity {
	@Property({ nullable: false })
	name!: string;
	@Property({ nullable: false })
	lastName!: string;
	@Property({ nullable: false })
	address!: string;
	@Property({ nullable: false })
	phone!: string;
	@Property({ nullable: false })
	@Unique()
	emailAddress!: string;

	get fullName(): string {
		return `${this.name} ${this.lastName}`;
	}
}
