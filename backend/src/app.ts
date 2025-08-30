import express from 'express';
import bookRoutes from './routes/bookRoutes';
import reservaRoutes from './routes/reservaRoutes';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/reservas', reservaRoutes);

export default app;
