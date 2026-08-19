const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../db');

const router = express.Router();

const leadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

router.post('/', leadLimiter, async (req, res) => {
  const { name, phone, email, description } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const result = await pool.query(
      'INSERT INTO leads (name, phone, email, description) VALUES ($1,$2,$3,$4) RETURNING id',
      [name, phone || null, email || null, description || null]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('lead create error', err);
    res.status(500).json({ error: 'Não foi possível registrar o contato agora.' });
  }
});

module.exports = router;
