import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let db;
let auth;

try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || '908059965361';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey && !privateKey.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...')) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✔ Initialized Firebase Admin SDK with Service Account');
    } else {
      initializeApp({ projectId });
      console.log('ℹ Initialized Firebase Admin SDK in project mode');
    }
  }

  db = getFirestore();
  auth = getAuth();
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization fallback active:', error.message);
}

export { db, auth };
