import admin from "firebase-admin";

function normalizePrivateKey(key = "") {
  return key.replace(/\\n/g, "\n");
}

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Firebase credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(FIREBASE_PRIVATE_KEY)
  });
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: getCredential()
  });
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
