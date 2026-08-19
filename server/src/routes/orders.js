const express = require('express');
const pool = require('../db');
const { optionalAuth } = require('../middleware/auth');
const { isValidUnitValue } = require('../catalog');

const router = express.Router();

const FRETE_FLAT = 24.9;
const COUPON_DISCOUNT_RATE = 0.1;

router.post('/', optionalAuth, async (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return res.status(400).json({ error: 'O carrinho está vazio.' });
  if (!body.paymentMethod || !['pix', 'cartao'].includes(body.paymentMethod)) {
    return res.status(400).json({ error: 'Forma de pagamento inválida.' });
  }
  if (!body.shipName || !body.shipAddress || !body.shipCity || !body.shipCep) {
    return res.status(400).json({ error: 'Preencha os dados de entrega.' });
  }
  for (const item of items) {
    if (!item.productId || item.unitValue == null || !item.qty || !isValidUnitValue(item.productId, item.unitValue)) {
      return res.status(400).json({ error: 'Um dos itens do carrinho é inválido.' });
    }
  }

  const subtotal = items.reduce((s, i) => s + Number(i.unitValue) * Number(i.qty), 0);
  const frete = FRETE_FLAT;
  const discount = body.couponCode ? subtotal * COUPON_DISCOUNT_RATE : 0;
  const total = Math.max(0, subtotal - discount + frete);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, payment_method, subtotal, frete, discount, total, ship_name, ship_address, ship_city, ship_cep, coupon_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [req.userId || null, body.paymentMethod, subtotal, frete, discount, total, body.shipName, body.shipAddress, body.shipCity, body.shipCep, body.couponCode || null]
    );
    const orderId = orderResult.rows[0].id;
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, variant_label, size_label, custom_text, unit_value, qty)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [orderId, item.productId, item.name, item.variantLabel || null, item.sizeLabel || null, item.customText || null, item.unitValue, item.qty]
      );
    }
    if (req.userId) {
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    }
    await client.query('COMMIT');
    res.status(201).json({ id: orderId, total });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('order create error', err);
    res.status(500).json({ error: 'Não foi possível confirmar o pedido agora.' });
  } finally {
    client.release();
  }
});

module.exports = router;
