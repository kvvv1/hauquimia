const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Não autenticado.' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
}

// Like requireAuth, but does not fail when there is no/invalid token —
// used by routes that behave differently for guests vs. logged-in users.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    } catch (e) {
      // ignore invalid token, proceed as guest
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
