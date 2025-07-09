const express = require('express');
const router = express.Router();
const db = require('../firebase'); // ✅ Use central Firebase
const admin = require('firebase-admin'); // Needed only for FieldValue
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);

require('dotenv').config();


// GET all inquiries for admin dashboard
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

router.post('/', async (req, res) => {
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
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db.collection('inquiries').add(inquiryData);

    // Validate SendGrid env vars
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER || !process.env.ADMIN_EMAIL) {
      console.error('SendGrid environment variables missing');
      return res.status(500).json({ error: 'Email service not configured' });
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
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    try {
      await sgMail.send(emailMsg);
    } catch (emailErr) {
      console.error('SendGrid error:', emailErr);
      return res.status(500).json({ error: 'Failed to send notification email' });
    }

    res.status(200).json({ message: 'Inquiry submitted successfully.' });
  } catch (err) {
    console.error('Error processing inquiry:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
