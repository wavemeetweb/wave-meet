const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Safer loading of service account JSON from environment
const accountJsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!accountJsonStr) {
  console.error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is missing.');
  process.exit(1); // Exit if missing for safety
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(accountJsonStr);
} catch (err) {
  console.error('Invalid JSON for FIREBASE_SERVICE_ACCOUNT_JSON:', err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// Protected route example
app.get('/profile', verifyToken, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email, name: req.user.name });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
