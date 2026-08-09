import dotenv from 'dotenv';

dotenv.config();

let db = null;
let auth = null;

// Safe lazy loading for Firebase Admin SDK to prevent ERR_REQUIRE_ESM in Vercel Serverless Functions
const initAdminSDK = async () => {
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    // Vercel Serverless uses Client Web SDK (server/config/firebase.js)
    return;
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey && !privateKey.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...')) {
    try {
      const { initializeApp, getApps, cert } = await import('firebase-admin/app');
      const { getFirestore } = await import('firebase-admin/firestore');
      const { getAuth } = await import('firebase-admin/auth');

      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || 'votersmood78',
            clientEmail,
            privateKey,
          }),
        });
        console.log('✔ Initialized Firebase Admin SDK with Service Account');
      }
      db = getFirestore();
      auth = getAuth();
    } catch (error) {
      console.warn('⚠️ Firebase Admin SDK serverless bypass active:', error.message);
    }
  }
};

initAdminSDK();

export { db, auth };
