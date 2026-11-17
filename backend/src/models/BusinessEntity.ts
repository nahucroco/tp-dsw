import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BusinessEntity {
	@PrimaryKey()
	id!: number;
	@Property({ hidden: true })
	createdAt: Date = new Date();
	@Property({ onUpdate: () => new Date(), hidden: true })
	updatedAt: Date = new Date();
}
