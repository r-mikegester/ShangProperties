// backend/sendgrid-test.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.ADMIN_EMAIL,
  from: process.env.SENDGRID_SENDER,
  subject: 'Test Email from Mike',
  text: 'This is a test email.',
};

sgMail.send(msg)
  .then(() => {
    console.log('✅ Test email sent successfully');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error);
  });
