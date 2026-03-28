const admin = require('firebase-admin');

/**
 * Initialise Firebase Admin SDK once.
 * Reads credentials from environment variables so no JSON key file is needed.
 */
function initFirebase() {
  if (admin.apps.length > 0) return; // already initialised

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // .env stores \n as literal "\\n" — replace so the key parses correctly
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[Firebase] Missing credentials – running without Firebase Admin. ' +
        'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env'
    );
    // Initialise with just project ID so Firestore emulator can be used locally
    admin.initializeApp({ projectId: projectId || 'saraswati-dev' });
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  console.log('[Firebase] Admin SDK initialised successfully');
}

initFirebase();

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
