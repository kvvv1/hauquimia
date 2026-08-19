require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const favoritesRoutes = require('./routes/favorites');
const ordersRoutes = require('./routes/orders');
const leadsRoutes = require('./routes/leads');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
}

const app = express();
app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: function (origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Origem não permitida: ' + origin));
  },
}));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/leads', leadsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Hauquímia API ouvindo na porta ' + port));
