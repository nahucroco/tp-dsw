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
			if (e instanceof NotFoundError) return null;
			throw e;
		}
	}

	async getAll(): Promise<Person[]> {
		return await em.find(Person, {});
	}

	async create(input: PersonInput): Promise<Person> {
		try {
			const person = new Person();
			person.name = input.name;
			person.lastName = input.lastName;
			person.address = input.address;
			person.phone = input.phone;
			person.emailAddress = input.emailAddress; // ya normalizado por el middleware
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

			// El email ya viene normalizado por el middleware
			toUpdate.name = input.name;
			toUpdate.lastName = input.lastName;
			toUpdate.address = input.address;
			toUpdate.phone = input.phone;
			toUpdate.emailAddress = input.emailAddress;

			await em.flush();
			return true;
		} catch (e) {
			console.error(`error updating person: ${e}`);
			throw e;
		}
	}

	async delete(id: number): Promise<boolean> {
		const toDelete = await this.getById(id);
		if (!toDelete) return false;
		await em.removeAndFlush(toDelete);
		return true;
	}
}
