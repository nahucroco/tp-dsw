import { NotFoundError } from '../errors/NotFoundError.js';
import { orm } from '../infrastructure/orm.js';
import { Author } from '../models/Author.js';
import type { AuthorInput } from '../schemas/AuthorSchema.js';
import type { IEntityService } from './interfaces/IEntityService.js';

const em = orm.em;
class AuthorService implements IEntityService<Author, AuthorInput> {
	async getById(id: number): Promise<Author> {
		const author = await em.findOne(
			Author,
			{ id: id },
			{ populate: ['books'] },
		);
		if (!author) {
			throw new NotFoundError('Author not found');
		}
		return author;
	}
	async getAll(): Promise<Author[]> {
		return await em.find(Author, {});
	}

	async create(input: AuthorInput): Promise<Author> {
		const author = new Author();
		author.name = input.name;
		em.create(Author, author);
		await em.flush();
		return author;
	}

	async update(input: AuthorInput): Promise<void> {
		const author = await this.getById(input.id);
		author.name = input.name;
		await em.flush();
	}

	async delete(id: number): Promise<void> {
		const author = await this.getById(id);

		await em.remove(author).flush();
	}
}

export default AuthorService;
