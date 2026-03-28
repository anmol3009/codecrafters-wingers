const { auth } = require('../config/firebase');

/**
 * Verify a Firebase ID token passed in the Authorization header.
 *
 * Expected header:  Authorization: Bearer <idToken>
 *
 * On success, attaches `req.user = { uid, email, name }` and calls next().
 * On failure, returns 401.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? '',
      name: decoded.name ?? decoded.email ?? 'User',
    };
    next();
  } catch (err) {
    console.error('[authMiddleware] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
