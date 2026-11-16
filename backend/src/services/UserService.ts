import { NotFoundError } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { orm } from '../infrastructure/orm.js';
import { Person } from '../models/Person.js';
import { User } from '../models/User.js';
import type { LoginInput } from '../schemas/LoginSchema.js';
import type { UserInput } from '../schemas/UserSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

class UserService implements IEntityService<User, UserInput> {
	private async buildUser(input: UserInput): Promise<User> {
		const hash = await bcrypt.hash(input.password, 10);
		const user = new User();
		user.username = input.username;
		user.password = hash;
		user.role = input.role;
		user.person = em.getReference(Person, input.person.id);
		return user;
	}
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
			const user = await this.buildUser(input);
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
			const user = await this.buildUser(input);
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
	async login(input: LoginInput): Promise<User | null> {
		try {
			const user = await em.findOneOrFail(
				User,
				{ username: input.username },
				{ populate: ['person'] },
			);
			if (!user) {
				return null;
			}
			const isValidPassword = await bcrypt.compare(
				input.password,
				user.password,
			);
			if (!isValidPassword) {
				return null;
			}
			return user;
		} catch (e) {
			console.error(`error login: ${e}`);
			throw e;
		}
	}
}

export default UserService;
