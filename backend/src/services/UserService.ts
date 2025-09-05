import type { IEntityService } from './interfaces/IEntityService';
import type { User } from '../models/User';
import { generateId, users } from '../data/UserData';

export class UserService implements IEntityService<User> {
	async getById(id: number): Promise<User | null> {
		const user = users.find((u) => u.id === id);
		if (!user) return null;
		return user;
	}
	async getAll(): Promise<User[]> {
		return users;
	}
	async create(entity: User): Promise<void> {
		entity.id = generateId();
		users.push(entity);
	}
	async update(entity: User): Promise<boolean> {
		const index = users.findIndex((u) => u.id === entity.id);
		if (index === -1) return false;
		users[index] = entity;
		return true;
	}
	async delete(id: number): Promise<boolean> {
		const index = users.findIndex((u) => u.id === id);
		if (index === -1) return false;
		users.splice(index, 1);
		return true;
	}
}
