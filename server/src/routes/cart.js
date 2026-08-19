const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { isValidUnitValue } = require('../catalog');

const router = express.Router();
router.use(requireAuth);

function toClientItem(row) {
  return {
    key: row.item_key,
    id: row.product_id,
    name: row.name,
    category: row.category,
    imgSrc: row.img_src,
    variantLabel: row.variant_label,
    sizeLabel: row.size_label,
    customText: row.custom_text,
    unitValue: Number(row.unit_value),
    qty: row.qty,
  };
}

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM cart_items WHERE user_id = $1 ORDER BY created_at', [req.userId]);
  res.json(result.rows.map(toClientItem));
});

router.post('/', async (req, res) => {
  const item = req.body || {};
  if (!item.key || !item.id || !item.name || item.unitValue == null || !item.qty) {
    return res.status(400).json({ error: 'Item de carrinho inválido.' });
  }
  if (!isValidUnitValue(item.id, item.unitValue)) {
    return res.status(400).json({ error: 'Preço do item não confere com o catálogo.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, item_key, product_id, name, category, img_src, variant_label, size_label, custom_text, unit_value, qty)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id, item_key) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty
       RETURNING *`,
      [req.userId, item.key, item.id, item.name, item.category || null, item.imgSrc || null, item.variantLabel || null, item.sizeLabel || null, item.customText || null, item.unitValue, Math.max(1, Math.min(9, item.qty))]
    );
    res.status(201).json(toClientItem(result.rows[0]));
  } catch (err) {
    console.error('cart add error', err);
    res.status(500).json({ error: 'Não foi possível adicionar ao carrinho.' });
  }
});

router.patch('/:key', async (req, res) => {
  const qty = Math.max(1, Math.min(9, Number(req.body && req.body.qty)));
  if (!qty) return res.status(400).json({ error: 'Quantidade inválida.' });
  const result = await pool.query(
    'UPDATE cart_items SET qty = $1 WHERE user_id = $2 AND item_key = $3 RETURNING *',
    [qty, req.userId, req.params.key]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Item não encontrado.' });
  res.json(toClientItem(result.rows[0]));
});

router.delete('/:key', async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1 AND item_key = $2', [req.userId, req.params.key]);
  res.status(204).end();
});

module.exports = router;
