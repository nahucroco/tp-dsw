import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/users', userRoutes);

export default app;
