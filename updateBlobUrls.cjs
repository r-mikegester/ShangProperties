const admin = require('firebase-admin');
const serviceAccount = require('./backend/serviceAccountKey.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Old and new blob storage URLs
const OLD_BLOB_URL = 'https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/';
const NEW_BLOB_URL = 'https://6ovgprfdguxo1bkn.public.blob.vercel-storage.com/';

async function updateBlobUrls() {
  console.log('Starting blob URL update process...');
  
  try {
    // Update homepage collection
    console.log('Updating homepage collection...');
    const homepageDoc = await db.collection('homepage').doc('content').get();
    
    if (homepageDoc.exists) {
      const homepageData = homepageDoc.data();
      let updated = false;
      
      // Update hero section
      if (homepageData.hero && homepageData.hero.backgroundUrl && 
          homepageData.hero.backgroundUrl.includes(OLD_BLOB_URL)) {
        homepageData.hero.backgroundUrl = homepageData.hero.backgroundUrl.replace(OLD_BLOB_URL, NEW_BLOB_URL);
        updated = true;
        console.log('Updated hero background URL');
      }
      
      // Update footer section
      if (homepageData.footer) {
        if (homepageData.footer.logoUrl && homepageData.footer.logoUrl.includes(OLD_BLOB_URL)) {
          homepageData.footer.logoUrl = homepageData.footer.logoUrl.replace(OLD_BLOB_URL, NEW_BLOB_URL);
          updated = true;
          console.log('Updated footer logo URL');
        }
        
        if (homepageData.footer.kuokGroupLogoUrl && homepageData.footer.kuokGroupLogoUrl.includes(OLD_BLOB_URL)) {
          homepageData.footer.kuokGroupLogoUrl = homepageData.footer.kuokGroupLogoUrl.replace(OLD_BLOB_URL, NEW_BLOB_URL);
          updated = true;
          console.log('Updated footer Kuok Group logo URL');
        }
        
        if (homepageData.footer.corSealUrl && homepageData.footer.corSealUrl.includes(OLD_BLOB_URL)) {
          homepageData.footer.corSealUrl = homepageData.footer.corSealUrl.replace(OLD_BLOB_URL, NEW_BLOB_URL);
          updated = true;
          console.log('Updated footer COR seal URL');
        }
      }
      
      // Save updated homepage data
      if (updated) {
        await db.collection('homepage').doc('content').set(homepageData);
        console.log('Homepage document updated successfully');
      }
    }
    
    // Update projects collection
    console.log('Updating projects collection...');
    const projectsSnapshot = await db.collection('projects').get();
    let projectsUpdated = 0;
    
    for (const doc of projectsSnapshot.docs) {
      const projectData = doc.data();
      let updated = false;
      
      // Update project image
      if (projectData.image && projectData.image.includes(OLD_BLOB_URL)) {
        projectData.image = projectData.image.replace(OLD_BLOB_URL, NEW_BLOB_URL);
        updated = true;
        console.log(`Updated image for project ${doc.id}`);
      }
      
      // Update gallery images
      if (projectData.gallery && Array.isArray(projectData.gallery)) {
        const updatedGallery = projectData.gallery.map((image) => {
          if (image && image.includes(OLD_BLOB_URL)) {
            const updatedImage = image.replace(OLD_BLOB_URL, NEW_BLOB_URL);
            updated = true;
            console.log(`Updated gallery image for project ${doc.id}`);
            return updatedImage;
          }
          return image;
        });
        
        if (updated) {
          projectData.gallery = updatedGallery;
        }
      }
      
      // Update 360 tours
      if (projectData.tours360 && Array.isArray(projectData.tours360)) {
        const updatedTours = projectData.tours360.map((tour) => {
          if (tour && tour.includes(OLD_BLOB_URL)) {
            const updatedTour = tour.replace(OLD_BLOB_URL, NEW_BLOB_URL);
            updated = true;
            console.log(`Updated 360 tour for project ${doc.id}`);
            return updatedTour;
          }
          return tour;
        });
        
        if (updated) {
          projectData.tours360 = updatedTours;
        }
      }
      
      // Save updated project data
      if (updated) {
        await db.collection('projects').doc(doc.id).set(projectData);
        projectsUpdated++;
      }
    }
    
    console.log(`Updated ${projectsUpdated} projects`);
    
    // Update any other collections that might contain blob URLs
    console.log('Checking for other collections with blob URLs...');
    
    // Example for any other collections that might have blob URLs
    // You can add more collections here as needed
    
    console.log('Blob URL update process completed successfully!');
  } catch (error) {
    console.error('Error updating blob URLs:', error);
  }
}

// Run the update function
updateBlobUrls().then(() => {
  console.log('Script execution finished');
  process.exit(0);
}).catch((error) => {
  console.error('Script execution failed:', error);
  process.exit(1);
});