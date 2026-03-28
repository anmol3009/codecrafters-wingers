const { db, auth } = require('../config/firebase');

const USERS_COL = 'users';

/**
 * Create a Firestore user document after Firebase Auth signup.
 * Safe to call even if doc already exists (idempotent).
 */
async function createUserDoc(uid, { name, email }) {
  const ref = db.collection(USERS_COL).doc(uid);
  const snap = await ref.get();
  if (snap.exists) return snap.data();

  const userData = {
    name: name || email,
    email,
    enrolledCourses: [],
    progress: {},
    createdAt: new Date().toISOString(),
  };
  await ref.set(userData);
  return userData;
}

/**
 * Get user document from Firestore.
 */
async function getUserDoc(uid) {
  const snap = await db.collection(USERS_COL).doc(uid).get();
  if (!snap.exists) return null;
  return { uid, ...snap.data() };
}

/**
 * Verify Firebase ID token and return decoded payload.
 */
async function verifyToken(idToken) {
  return auth.verifyIdToken(idToken);
}

module.exports = { createUserDoc, getUserDoc, verifyToken };
