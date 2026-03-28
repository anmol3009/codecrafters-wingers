const admin = require('firebase-admin');

/**
 * Initialise Firebase Admin SDK once.
 * Reads credentials from environment variables so no JSON key file is needed.
 */
function initFirebase() {
  if (admin.apps.length > 0) return; // already initialised

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[Firebase] ⚠️ Missing credentials. Backend will run in LIMITED MODE. ' +
        'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env to enable full Auth/Firestore.'
    );
    
    // Initialise with dummy params so that admin.firestore() and admin.auth() 
    // don't immediately crash the application on inclusion.
    admin.initializeApp({
      projectId: projectId || 'saraswati-dev-mock',
    });
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    console.log('[Firebase] Admin SDK initialised successfully');
  } catch (error) {
    console.error('[Firebase] ❌ Failed to initialise Admin SDK:', error.message);
    admin.initializeApp({ projectId: projectId || 'saraswati-dev-mock' });
  }
}

initFirebase();

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
