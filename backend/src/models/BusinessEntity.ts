import { PrimaryKey } from '@mikro-orm/core';

export abstract class BusinessEntity {
	@PrimaryKey()
	id!: number;
}
