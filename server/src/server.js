import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import entriesRoutes from './routes/entries.js';


const app = express();


app.use(express.json());
app.use(
cors({
origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*',
credentials: false
})
);


app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);


const PORT = process.env.PORT || 8080;


(async () => {
await connectDB(process.env.MONGODB_URI);
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
})();