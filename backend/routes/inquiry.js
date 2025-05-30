const express = require('express');
const router = express.Router();
const db = require('../firebase'); // ✅ Use central Firebase
const admin = require('firebase-admin'); // Needed only for FieldValue
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);

require('dotenv').config();


router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    property,
    inquiryType,
    message,
  } = req.body;

  if (!email || !firstName || !lastName || !phone || !country || !property || !inquiryType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const inquiryData = {
    firstName,
    lastName,
    email,
    phone,
    country,
    property,
    inquiryType,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db.collection('inquiries').add(inquiryData);

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
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sgMail.send(emailMsg);

    res.status(200).json({ message: 'Inquiry submitted successfully.' });
  } catch (err) {
    console.error('Error processing inquiry:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
