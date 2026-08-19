const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { isKnownProduct } = require('../catalog');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT product_id FROM favorites WHERE user_id = $1 ORDER BY created_at', [req.userId]);
  res.json(result.rows.map((r) => r.product_id));
});

router.post('/', async (req, res) => {
  const productId = req.body && req.body.productId;
  if (!productId || !isKnownProduct(productId)) return res.status(400).json({ error: 'Produto inválido.' });
  await pool.query(
    'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
    [req.userId, productId]
  );
  res.status(201).json({ productId });
});

router.delete('/:productId', async (req, res) => {
  await pool.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [req.userId, req.params.productId]);
  res.status(204).end();
});

module.exports = router;
