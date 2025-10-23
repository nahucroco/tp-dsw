import 'reflect-metadata';
import { RequestContext } from '@mikro-orm/core';
import express from 'express';
import { orm, syncSchema } from './data/orm.js';
import authorRoutes from './routes/authorRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import genderRoutes from './routes/genderRoutes.js';

const app = express();

app.use(express.json());
app.use((_req, _res, next) => {
	RequestContext.create(orm.em, next);
});
await syncSchema(); // only in dev;
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genders', genderRoutes);
app.use((_, res) => {
	return res.status(404).send({ message: 'Not Found' });
});
export default app;
