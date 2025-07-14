import admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

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

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, country, property, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !country || !property) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
      // Save to Firestore
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

      // Send email with SendGrid
      const msg = {
        to: process.env.SENDGRID_TO_EMAIL, // recipient
        from: process.env.SENDGRID_FROM_EMAIL, // verified sender
        subject: `New Inquiry from ${firstName} ${lastName}`,
        text: `
New Inquiry Received:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Country: ${country}
Property: ${property}
Message: ${message || '(none)'}
        `,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Property:</strong> ${property}</p>
          <p><strong>Message:</strong> ${message || '(none)'}</p>
        `,
      };
      await sgMail.send(msg);

      return res.status(200).json({ success: true, message: 'Inquiry saved and email sent.' });
    } catch (err) {
      console.error('Firestore or SendGrid error:', err, JSON.stringify(err));
      return res.status(500).json({ error: err.message || 'Failed to save inquiry or send email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}