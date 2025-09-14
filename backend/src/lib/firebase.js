import admin from 'firebase-admin';

let db;

try {
  console.log('Initializing Firebase Admin...');
  
  // Try to initialize with service account key from environment variable
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}';
  
  if (serviceAccountKey !== '{}' && serviceAccountKey.trim() !== '') {
    try {
      console.log('Attempting to parse FIREBASE_SERVICE_ACCOUNT_KEY...');
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      if (Object.keys(serviceAccount).length > 0 && !admin.apps.length) {
        console.log('Initializing Firebase with service account');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin initialized with service account');
      } else if (admin.apps.length) {
        console.log('Firebase already initialized');
      }
    } catch (parseError) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY length:', serviceAccountKey.length);
    }
  } 
  
  // If no service account or parsing failed, try to initialize with default credentials
  if (!admin.apps.length) {
    try {
      console.log('Attempting to initialize Firebase with default credentials');
      admin.initializeApp();
      console.log('Firebase Admin initialized with default credentials');
    } catch (initError) {
      console.error('Failed to initialize Firebase Admin with default credentials:', initError.message);
      // Try to initialize with explicit project ID from environment
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || process.env.FIREBASE_PROJECT_ID;
      if (projectId) {
        try {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: projectId
          });
          console.log(`Firebase Admin initialized with project ID: ${projectId}`);
        } catch (projectIdError) {
          console.error(`Failed to initialize Firebase with project ID ${projectId}:`, projectIdError.message);
        }
      } else {
        console.log('No Firebase project configuration found. Running in limited mode.');
      }
    }
  }
  
  // Only try to get firestore if admin is initialized
  if (admin.apps.length > 0) {
    console.log('Initializing Firestore database');
    db = admin.firestore();
    console.log('Firestore initialized successfully');
  } else {
    db = undefined;
    console.log('Firestore not available: Firebase Admin not initialized');
  }
} catch (error) {
  console.error('Critical error during Firebase initialization:', error);
  db = undefined;
}

export { db, admin };