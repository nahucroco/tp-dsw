export interface IEntityService<T, TInput = T> {
	getById(id: number): Promise<T | null>;
	getAll(): Promise<T[]>;
	create(input: TInput): Promise<T>;
	update(input: TInput): Promise<boolean>;
	delete(id: number): Promise<boolean>;
}
