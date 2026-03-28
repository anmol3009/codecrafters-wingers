const { createUserDoc, getUserDoc } = require('../services/authService');

/**
 * POST /auth/signup
 *
 * The frontend uses Firebase SDK to create the user in Auth,
 * then sends the idToken here so we can create the Firestore doc.
 *
 * Body: { name, email }
 * Header: Authorization: Bearer <idToken>  (verified by authMiddleware)
 */
async function signup(req, res, next) {
  try {
    const { uid, email, name } = req.user; // populated by authMiddleware
    const body = req.body;

    const userData = await createUserDoc(uid, {
      name: body.name || name,
      email,
    });

    res.status(201).json({ message: 'Account created', user: userData });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/login
 *
 * Validates token (done by authMiddleware) and ensures user doc exists.
 * Body: { email, password }  — actual auth is handled by Firebase on the client.
 */
async function login(req, res, next) {
  try {
    const { uid, email, name } = req.user;
    let user = await getUserDoc(uid);

    if (!user) {
      user = await createUserDoc(uid, { name, email });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/google
 *
 * Same flow as login — Firebase Google sign-in is handled client-side.
 * We just ensure the Firestore document exists.
 */
async function googleAuth(req, res, next) {
  try {
    const { uid, email, name } = req.user;
    let user = await getUserDoc(uid);

    if (!user) {
      user = await createUserDoc(uid, { name, email });
    }

    res.json({ message: 'Google sign-in successful', user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /auth/me
 *
 * Return the current authenticated user's profile from Firestore.
 */
async function getMe(req, res, next) {
  try {
    const user = await getUserDoc(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, googleAuth, getMe };
