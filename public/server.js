const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// Initialize Firebase Admin SDK with secret JSON env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
// Sample protected API
app.get('/profile', verifyToken, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email, name: req.user.name });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Firebase Admin backend running on port ${PORT}`));
