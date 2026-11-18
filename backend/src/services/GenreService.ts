import { NotFoundError } from '../errors/NotFoundError.js';
import { orm } from '../infrastructure/orm.js';
import { Genre } from '../models/Genre.js';
import type { GenreInput } from '../schemas/GenreSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;

export class GenreService implements IEntityService<Genre, GenreInput> {
	async getById(id: number): Promise<Genre> {
		const genre = await em.findOne(Genre, { id });
		if (!genre) {
			throw new NotFoundError('Genre not found');
		}
		return genre;
	}

	async getAll(): Promise<Genre[]> {
		return await em.find(Genre, {});
	}

	async create(input: GenreInput): Promise<Genre> {
		const gender = new Genre();
		gender.description = input.description;
		em.create(Genre, gender);
		await em.flush();
		return gender;
	}

	async update(input: GenreInput): Promise<void> {
		const genre = await this.getById(input.id);
		genre.description = input.description;
		await em.flush();
	}

	async delete(id: number): Promise<void> {
		const genre = await this.getById(id);
		await em.remove(genre).flush();
	}
}
