import express from 'express';
import cors from 'cors';
import logger from './middleware/logger.js';
import routes from './routes/index.js';

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api', routes);


app.get('/', (req, res) => {
    res.json({ success: true, message: 'AI Task Processor API is running' });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ success: false, error: `${field} already exists` });
    }
    // Mongoose CastError (bad ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
});

export default app;

