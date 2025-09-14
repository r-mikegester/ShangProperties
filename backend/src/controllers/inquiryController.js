import { db, admin } from '../lib/firebase.js';

// Utility function to check if Firebase is initialized
const isFirebaseInitialized = () => {
  const initialized = db !== undefined && admin !== undefined && admin.apps.length > 0;
  console.log('Firebase initialized check:', initialized);
  return initialized;
};

// CREATE Inquiry
export const handleInquiry = async (req, res) => {
  try {
    console.log('Received inquiry request:', req.body);
    
    // Check if Firebase is properly initialized
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ 
        success: false, 
        error: 'Database service not available. Firebase not properly configured.' 
      });
    }

    const { firstName, lastName, email, country, property, message, phone } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !country || !property) {
      console.error('Missing required fields:', { firstName, lastName, email, country, property });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: firstName, lastName, email, country, and property are required.' 
      });
    }

    console.log('Adding inquiry to Firestore...');
    const docRef = await db.collection('inquiries').add({
      firstName,
      lastName,
      email,
      country,
      property,
      message: message || '',
      phone: phone || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('Inquiry successfully saved with ID:', docRef.id);
    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process inquiry. Please try again later.' 
    });
  }
};

// READ All Inquiries
export const getInquiries = async (req, res) => {
  try {
    console.log('Fetching inquiries...');
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ 
        success: false, 
        error: 'Database service not available. Firebase not properly configured.' 
      });
    }

    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to retrieve inquiries. Please try again later.' 
    });
  }
};

// UPDATE Inquiry
export const updateInquiry = async (req, res) => {
  try {
    console.log('Updating inquiry:', req.params.id);
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ 
        success: false, 
        error: 'Database service not available. Firebase not properly configured.' 
      });
    }

    const { id } = req.params;
    const data = req.body;
    await db.collection('inquiries').doc(id).update({ 
      ...data, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update inquiry. Please try again later.' 
    });
  }
};

// DELETE Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    console.log('Deleting inquiry:', req.params.id);
    if (!isFirebaseInitialized()) {
      console.error('Database service not available - Firebase not initialized');
      return res.status(500).json({ 
        success: false, 
        error: 'Database service not available. Firebase not properly configured.' 
      });
    }

    const { id } = req.params;
    await db.collection('inquiries').doc(id).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete inquiry. Please try again later.' 
    });
  }
};