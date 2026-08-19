const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
});

function toPublicUser(row) {
  return { id: row.id, name: row.name, email: row.email };
}
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || String(password).length < 6) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.' });
  }
  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [String(name).trim(), normalizedEmail, hash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: signToken(user.id), user: toPublicUser(user) });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Não foi possível criar sua conta agora.' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });
  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    const row = result.rows[0];
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    res.json({ token: signToken(row.id), user: toPublicUser(row) });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Não foi possível entrar agora.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
    if (!result.rows[0]) return res.status(401).json({ error: 'Usuário não encontrado.' });
    res.json(toPublicUser(result.rows[0]));
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ error: 'Erro ao carregar usuário.' });
  }
});

module.exports = router;
