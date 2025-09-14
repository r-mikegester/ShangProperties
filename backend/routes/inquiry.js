const express = require('express');
const router = express.Router();
const { db, admin } = require('../src/lib/firebase'); // Use the proper Firebase setup
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');

// Utility function to check if Firebase is initialized
const isFirebaseInitialized = () => {
  return db !== undefined && admin !== undefined && admin.apps.length > 0;
};


// GET all inquiries for admin dashboard
router.get('/', async (req, res) => {
  try {
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ error: 'Database service not available. Firebase not properly configured.' });
    }
    
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries: ' + err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Received inquiry request:', req.body);
    
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ error: 'Database service not available. Firebase not properly configured.' });
    }
    
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      property,
      message,
    } = req.body;

    // Debug: log received fields
    console.log('Received:', { email, firstName, lastName, phone, country, property, message });
    // Only require the fields actually used
    if (!email || !firstName || !lastName || !phone || !country || !property) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const inquiryData = {
      firstName,
      lastName,
      email,
      phone,
      country,
      property,
      message: message || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      const docRef = await db.collection('inquiries').add(inquiryData);
      console.log('Inquiry successfully saved with ID:', docRef.id);

      // Emit real-time event via socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit('new_inquiry', {
          id: docRef.id,
          firstName,
          lastName,
          email,
          phone,
          country,
          property,
          message,
          createdAt: new Date().toISOString(),
        });
      }

      // Validate SendGrid env vars
      if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER || !process.env.ADMIN_EMAIL) {
        console.error('SendGrid environment variables missing');
        return res.status(200).json({ success: true, id: docRef.id }); // Still success for user
      }

      const emailMsg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.SENDGRID_SENDER,
        subject: 'New Inquiry Received',
        html: `
          <h3>New Inquiry</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Property:</strong> ${property}</p>
          <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        `,
      };

      try {
        await sgMail.send(emailMsg);
      } catch (emailErr) {
        console.error('SendGrid error:', emailErr);
        // Don't fail the request if email fails
      }

      res.status(200).json({ success: true, id: docRef.id });
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ error: 'Failed to save inquiry: ' + dbError.message });
    }
  } catch (err) {
    console.error('Unexpected error in inquiry route:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

module.exports = router;
