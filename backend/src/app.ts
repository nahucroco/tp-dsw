import express from 'express';
import bookRoutes from './routes/bookRoutes';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);

export default app;
