export interface IEntityService<T> {
	getById(id: number): Promise<T | null>;
	getAll(): Promise<T[]>;
	create(entity: T): Promise<void>;
	update(entity: T): Promise<boolean>;
	delete(id: number): Promise<boolean>;
}
