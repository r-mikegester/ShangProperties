import admin from 'firebase-admin';

// Initialize Firebase Admin SDK using environment variables (Vercel-friendly)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, country, property, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !country || !property) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
      await db.collection('inquiries').add({
        firstName,
        lastName,
        email,
        phone,
        country,
        property,
        message: message || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true, message: 'Inquiry saved.' });
    } catch (err) {
      console.error('Firestore error:', err);
      return res.status(500).json({ error: 'Failed to save inquiry.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
