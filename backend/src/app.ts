import 'reflect-metadata';
import { RequestContext } from '@mikro-orm/core';
import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { orm, syncSchema } from './data/orm.js';

const app = express();

app.use(express.json());
app.use((req, res, next) => {
	RequestContext.create(orm.em, next);
});
await syncSchema(); // only in dev;
app.use('/api/books', bookRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/users', userRoutes);
app.use((_, res) => {
	return res.status(404).send({ message: 'Not Found' });
});
export default app;
