import { db, admin } from '../lib/firebase.js';

// CREATE Inquiry
export const handleInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, country, property, message, phone } = req.body;
    const docRef = await db.collection('inquiries').add({
      firstName,
      lastName,
      email,
      country,
      property,
      message,
      phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ All Inquiries
export const getInquiries = async (req, res) => {
  try {
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE Inquiry
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('inquiries').doc(id).update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inquiries').doc(id).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
