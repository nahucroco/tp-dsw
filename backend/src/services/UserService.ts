import { NotFoundError } from '@mikro-orm/core';
import { orm } from '../data/orm.js';
import { Person } from '../models/Person.js';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import type { UserInput } from '../schemas/UserSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class UserService implements IEntityService<User, UserInput> {
	async getById(id: number): Promise<User | null> {
		try {
			return await em.findOneOrFail(User, { id }, { populate: ['person'] });
		} catch (e) {
			console.error(`error getById: ${e}`);
			if (e instanceof NotFoundError) {
				return null;
			}
			throw e;
		}
	}
	async getAll(): Promise<User[]> {
		try {
			return await em.find(User, {}, { populate: ['person'] });
		} catch (e) {
			console.error(`error getAll: ${e}`);
			return [];
		}
	}

	async create(input: UserInput): Promise<User> {
		try {
			const hash = await bcrypt.hash(input.password, 10);
			const user = new User();
			user.username = input.username;
			user.password = hash;
			user.role = 'user';
			user.person = em.getReference(Person, input.person.id);
			em.create(User, user);
			await em.flush();
			return user;
		} catch (e) {
			console.error(`error create: ${e}`);
			throw e;
		}
	}

	async update(input: UserInput): Promise<boolean> {
		try {
			const toUpdate = await this.getById(input.id);
			if (!toUpdate) {
				return false;
			}
			const hash = await bcrypt.hash(input.password, 10);
			const user = new User();
			user.username = input.username;
			user.password = hash;
			user.role = 'user';
			user.person = em.getReference(Person, input.person.id);
			em.assign(toUpdate, user);
			await em.flush();
			return true;
		} catch (e) {
			console.error(`error update: ${e}`);
			throw e;
		}
	}

	async delete(id: number): Promise<boolean> {
		try {
			const toDelete = await this.getById(id);
			if (!toDelete) {
				return false;
			}
			await em.removeAndFlush(toDelete);
			return true;
		} catch (e) {
			console.error(`error deleting: ${e}`);
			throw e;
		}
	}
}
