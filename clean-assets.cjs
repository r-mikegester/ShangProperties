const { list, del } = require('@vercel/blob');
const path = require('path');

// Configuration
const BLOB_TOKEN = 'vercel_blob_rw_6OVGprFdgUXO1bKn_3eHabxpwYcpileMXrvoh6bmkzwzIVx';

console.log('Starting asset cleanup from Vercel Blob storage...\n');

// Function to list all blobs with pagination
async function listAllBlobs() {
  console.log('Listing all blobs with pagination...\n');
  
  let allBlobs = [];
  let paginationToken = undefined;
  let page = 1;
  
  do {
    try {
      console.log(`Fetching page ${page}...`);
      const result = await list({
        token: BLOB_TOKEN,
        limit: 1000, // Limit to 1000 per page to avoid hitting limits
        paginationToken: paginationToken,
      });
      
      allBlobs = [...allBlobs, ...result.blobs];
      paginationToken = result.paginationToken;
      page++;
      
      console.log(`   Found ${result.blobs.length} blobs on this page`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error fetching page ${page}:`, error.message);
      break;
    }
  } while (paginationToken);
  
  console.log(`\n📊 Total blobs found: ${allBlobs.length}\n`);
  return allBlobs;
}

// Function to delete all blobs
async function deleteAllBlobs() {
  console.log('Deleting all blobs...\n');
  
  try {
    const allBlobs = await listAllBlobs();
    
    if (allBlobs.length === 0) {
      console.log('ℹ️  No blobs found to delete');
      return;
    }
    
    console.log(`🗑️  Deleting ${allBlobs.length} blobs...\n`);
    
    let deletedCount = 0;
    for (const blob of allBlobs) {
      try {
        await del(blob.url, {
          token: BLOB_TOKEN,
        });
        console.log(`✅ Deleted: ${blob.pathname}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete ${blob.pathname}:`, error.message);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`\n🎉 Cleanup completed. Successfully deleted ${deletedCount}/${allBlobs.length} blobs.`);
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

// Run the cleanup
deleteAllBlobs().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});

