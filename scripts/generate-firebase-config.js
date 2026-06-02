#!/usr/bin/env node
/**
 * Generates firebase-config.js from the FIREBASE_CONFIG_JSON environment variable.
 * Run via: node scripts/generate-firebase-config.js
 *
 * Required env var:
 *   FIREBASE_CONFIG_JSON — the Firebase config JSON object (from Firebase Console
 *                          → Project Settings → Your apps → SDK setup → Config)
 *
 * Output: firebase-config.js at the project root
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "..", "firebase-config.js");

function generate() {
  const raw = process.env.FIREBASE_CONFIG_JSON;

  if (!raw) {
    console.error(
      "Error: FIREBASE_CONFIG_JSON environment variable is not set.",
    );
    console.error(
      "Set it to the Firebase config JSON object from Firebase Console.",
    );
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch {
    console.error("Error: FIREBASE_CONFIG_JSON is not valid JSON.");
    process.exit(1);
  }

  const requiredKeys = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missing = requiredKeys.filter((k) => !config[k]);
  if (missing.length) {
    console.error(
      `Error: Firebase config is missing required keys: ${missing.join(", ")}`,
    );
    process.exit(1);
  }

  const content = `import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

const firebaseConfig = ${JSON.stringify(config, null, 2)};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
`;

  writeFileSync(OUTPUT_PATH, content, "utf8");
  console.log(`firebase-config.js generated at: ${OUTPUT_PATH}`);
}

generate();
