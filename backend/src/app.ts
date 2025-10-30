import 'reflect-metadata';
import { RequestContext } from '@mikro-orm/core';
import express from 'express';
import { orm, syncSchema } from './data/orm.js';
import authorRoutes from './routes/authorRoutes.js';
import bookCopyRoutes from './routes/bookCopyRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import genderRoutes from './routes/genderRoutes.js';
import cors from 'cors';
import loanRoutes from "./routes/loanRoutes.js";
import personRoutes from './routes/personRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = ['http://localhost:5174'];
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);

app.use(express.json());
app.use(
	(
		_req: express.Request,
		_res: express.Response,
		next: express.NextFunction,
	) => {
		RequestContext.create(orm.em, next);
	},
);
await syncSchema(); // only in dev;
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genders', genderRoutes);
app.use('/api/book_copies', bookCopyRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use((_req: express.Request, res: express.Response) => {
	return res.status(404).send({ message: 'Not Found' });
});
export default app;
