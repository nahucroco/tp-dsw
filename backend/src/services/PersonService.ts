import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Person } from '../models/Person.js';
import type { PersonInput } from '../schemas/PersonSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class PersonService implements IEntityService<Person, PersonInput> {
	async getById(id: number): Promise<Person | null> {
		try {
			return await em.findOneOrFail(Person, { id });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}
	async getAll(): Promise<Person[]> {
		try {
			return await em.find(Person, {});
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}
	async create(input: PersonInput): Promise<Person> {
		try {
			const person = new Person();
			person.name = input.name;
			person.lastName = input.lastName;
			person.address = input.address;
			person.phone = input.phone;
			person.emailAddress = input.emailAddress;
			em.create(Person, person);
			await em.flush();
			return person;
		} catch (e) {
			console.error(`error creating person: ${e}`);
			throw e;
		}
	}
	async update(input: PersonInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) return false;
			const person = new Person();
			person.name = input.name;
			person.lastName = input.lastName;
			person.address = input.address;
			person.phone = input.phone;
			person.emailAddress = input.emailAddress;
			em.assign(Person, Person);
			await em.flush();
			return true;
		} catch (e) {
			console.error(`error updating person: ${e}`);
			throw e;
		}
	}
	async delete(id: number): Promise<boolean> {
		try {
			const toDelete = await this.getById(id);
			if (!toDelete) return false;
			await em.removeAndFlush(toDelete);
			return true;
		} catch (e) {
			console.error(`error deleting person: ${e}`);
			throw e;
		}
	}
}
