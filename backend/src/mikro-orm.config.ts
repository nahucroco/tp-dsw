import { defineConfig } from '@mikro-orm/postgresql';
import { Reserva } from './models/Reserva';
import { Book } from './models/Book';

export default defineConfig({
  entities: [Book, Reserva],          
  clientUrl: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: 'migrations',
    tableName: 'mikroorm_migrations',
  },
});
