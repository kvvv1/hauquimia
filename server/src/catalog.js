// Server-side mirror of the front-end catalog (app.js), used only to
// validate that product ids / prices submitted by clients are legitimate
// before writing cart items or orders. Keep in sync with app.js PRODUCTS.
const PRODUCTS = {
  col1: { value: 399, variants: null },
  col2: { value: 290, variants: null },
  col3: { value: 550, variants: null },
  col4: { value: 650, variants: null },
  col5: { value: 880, variants: null },
  col6: { value: 380, variants: null },
  col7: { value: 380, variants: null },
  col8: { value: 490, variants: null },
  col9: { value: 525, variants: null },
  col10: { value: 590, variants: null },
  col11: { value: 360, variants: [360, 430, 550] },

  pul1: { value: 180, variants: null },
  pul2: { value: 199, variants: null },
  pul3: { value: 225, variants: null },
  pul4: { value: 290, variants: null },
  pul5: { value: 240, variants: null },

  ane1: { value: 180, variants: null },
  ane2: { value: 260, variants: null },
  ane3: { value: 320, variants: [320, 360] },
  ane4: { value: 810, variants: null },

  bri1: { value: 399, variants: [399, 599, 799] },
  bri2: { value: 250, variants: null },
  bri3: { value: 350, variants: null },
  bri4: { value: 155, variants: null },
  bri5: { value: 210, variants: null },
  bri6: { value: 139, variants: [139, 179, 218] },
  bri7: { value: 250, variants: null },
  bri8: { value: 238, variants: null },
  bri9: { value: 129, variants: null },
  bri10: { value: 798, variants: null },

  pin1: { value: 155, variants: null },
  pin2: { value: 399, variants: null },
  pin3: { value: 235, variants: null },
  pin4: { value: 960, variants: null },
};

function isKnownProduct(id) {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, id);
}

// Accepts the unitValue a client submitted for a product/variant and
// returns whether it matches one of the legitimate prices for that item.
function isValidUnitValue(productId, unitValue) {
  const p = PRODUCTS[productId];
  if (!p) return false;
  const n = Number(unitValue);
  if (p.variants) return p.variants.includes(n);
  return n === p.value;
}

module.exports = { PRODUCTS, isKnownProduct, isValidUnitValue };
