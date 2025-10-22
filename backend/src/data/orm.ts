import { MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from 'dotenv';

dotenv.config();
export const orm = await MikroORM.init({
	entities: ['./dist/models/**/*.js'],
	entitiesTs: ['./src/models/**/*.ts'],
	dbName: process.env.DB_NAME,
	clientUrl: process.env.DB_URL,
	highlighter: new SqlHighlighter(),
	debug: true,
	schemaGenerator: {
		disableForeignKeys: true,
		createForeignKeyConstraints: true,
		ignoreSchema: [],
	},
});
export const syncSchema = async () => {
	const generator = orm.getSchemaGenerator();
	await generator.updateSchema();
};
