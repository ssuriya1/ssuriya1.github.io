#!/usr/bin/env node
/**
 * Generates firestore.rules from firestore.rules.template using the FIREBASE_ADMIN_UID environment variable.
 * Run via: node scripts/generate-firestore-rules.js
 *
 * Required env var:
 *   FIREBASE_ADMIN_UID — Your Firebase Authentication UID (the account that can edit portfolio config)
 *
 * Output: firestore.rules at the project root (with UID injected)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = resolve(__dirname, '..', 'firestore.rules.template');
const OUTPUT_PATH = resolve(__dirname, '..', 'firestore.rules');

function generate() {
  const uid = process.env.FIREBASE_ADMIN_UID;

  if (!uid) {
    console.error('Error: FIREBASE_ADMIN_UID environment variable is not set.');
    console.error('Set it to your Firebase Authentication UID.');
    console.error(
      'Find it: Firebase Console → Authentication → Users → copy the UID for your account',
    );
    process.exit(1);
  }

  if (!uid.match(/^[a-zA-Z0-9]+$/)) {
    console.error(
      'Error: FIREBASE_ADMIN_UID looks invalid. UIDs are alphanumeric strings.',
    );
    console.error(`Got: ${uid}`);
    process.exit(1);
  }

  let template;
  try {
    template = readFileSync(TEMPLATE_PATH, 'utf8');
  } catch {
    console.error(
      `Error: Could not read template file at ${TEMPLATE_PATH}`,
    );
    process.exit(1);
  }

  const content = template.replace('ADMIN_UID_PLACEHOLDER', uid);

  writeFileSync(OUTPUT_PATH, content, 'utf8');
  console.log(`firestore.rules generated at: ${OUTPUT_PATH}`);
}

generate();
