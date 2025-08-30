/* import 'reflect-metadata';
import app from './app';


app.listen(3000, () => {
	console.log(`Servidor corriendo en http://localhost:3000`);
});
 */

import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { MikroORM, RequestContext } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import app from './app';

async function bootstrap() {
  const orm = await MikroORM.init(mikroConfig);

  // Crea un EM por request (aislamiento de contexto)
  app.use((req, _res, next) => {
    RequestContext.create(orm.em, next);
  });

  // Exponer el orm por si lo necesitás en otros módulos
  app.locals.orm = orm;

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
