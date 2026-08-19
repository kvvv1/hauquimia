-- Hauquímia backend schema.
-- Run with: node src/migrate.js  (or psql -f this file)

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_key       TEXT NOT NULL,
  product_id     TEXT NOT NULL,
  name           TEXT NOT NULL,
  category       TEXT,
  img_src        TEXT,
  variant_label  TEXT,
  size_label     TEXT,
  custom_text    TEXT,
  unit_value     NUMERIC(10,2) NOT NULL,
  qty            INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_key)
);

CREATE TABLE IF NOT EXISTS favorites (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status         TEXT NOT NULL DEFAULT 'aguardando_pagamento',
  payment_method TEXT NOT NULL,
  subtotal       NUMERIC(10,2) NOT NULL,
  frete          NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total          NUMERIC(10,2) NOT NULL,
  ship_name      TEXT,
  ship_address   TEXT,
  ship_city      TEXT,
  ship_cep       TEXT,
  coupon_code    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id             SERIAL PRIMARY KEY,
  order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     TEXT NOT NULL,
  name           TEXT NOT NULL,
  variant_label  TEXT,
  size_label     TEXT,
  custom_text    TEXT,
  unit_value     NUMERIC(10,2) NOT NULL,
  qty            INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
