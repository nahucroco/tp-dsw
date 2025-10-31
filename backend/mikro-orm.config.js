// mikro-orm.config.js (ESM)
import { defineConfig } from '@mikro-orm/mysql';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  dbName: process.env.DB_NAME || 'tp_dsw',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),

  // 👇 SOLO modelos compilados
  entities: ['./dist/models'],

  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },

  debug: process.env.NODE_ENV !== 'production',
});
