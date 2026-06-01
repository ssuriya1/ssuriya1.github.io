/**
 * Firebase Configuration Template
 * ─────────────────────────────────────────────────────────────
 * This file is a TEMPLATE for local development.
 * The real `firebase-config.js` is GITIGNORED and generated
 * automatically during GitHub Actions CI/CD from Repository Secrets.
 *
 * ── Local Development Setup ───────────────────────────────────
 * 1. Copy this file: cp firebase-config.template.js firebase-config.js
 * 2. Fill in your Firebase project values below
 * 3. firebase-config.js will NOT be committed to git (it's gitignored)
 *
 * ── GitHub Secrets Required (for CI/CD deployment) ────────────
 * Set these in: GitHub repo → Settings → Secrets → Actions
 *   FIREBASE_API_KEY
 *   FIREBASE_AUTH_DOMAIN
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_STORAGE_BUCKET
 *   FIREBASE_MESSAGING_SENDER_ID
 *   FIREBASE_APP_ID
 *   FIREBASE_MEASUREMENT_ID
 *
 * ── Note on Security ──────────────────────────────────────────
 * Firebase web-SDK API keys are designed to be used in client-side
 * code. Security is enforced via Firestore Security Rules (firestore.rules),
 * NOT by hiding the key. Storing them in GitHub Secrets keeps them
 * out of git history, which is best practice.
 * ─────────────────────────────────────────────────────────────
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
