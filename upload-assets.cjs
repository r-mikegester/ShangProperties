const { put, list, del } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Configuration
const BLOB_TOKEN = 'vercel_blob_rw_6OVGprFdgUXO1bKn_3eHabxpwYcpileMXrvoh6bmkzwzIVx';
const ASSETS_DIR = path.join(__dirname, 'src', 'assets');

console.log('Starting asset upload to Vercel Blob storage...\n');

// Function to upload a single file
async function uploadFile(filePath) {
  try {
    console.log(`Uploading ${filePath}...`);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Upload to Vercel Blob (directly to root, no folder structure)
    const blob = await put(fileName, fileBuffer, {
      access: 'public',
      token: BLOB_TOKEN,
    });
    
    console.log(`✅ Uploaded: ${fileName}`);
    console.log(`   URL: ${blob.url}\n`);
    return blob.url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

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
    
    console.log(`\n--- Deletion Summary ---`);
    console.log(`✅ Successfully deleted: ${deletedCount}`);
    console.log(`❌ Failed deletions: ${allBlobs.length - deletedCount}`);
    
  } catch (error) {
    console.error('❌ Error during deletion process:', error.message);
  }
}

// Function to recursively find all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
}

// Main upload function
async function uploadAllAssets() {
  try {
    // Check if assets directory exists
    if (!fs.existsSync(ASSETS_DIR)) {
      console.log(`❌ Assets directory not found: ${ASSETS_DIR}`);
      return;
    }
    
    console.log(`📁 Scanning assets directory: ${ASSETS_DIR}\n`);
    
    // Get all files in assets directory
    const files = getAllFiles(ASSETS_DIR);
    
    if (files.length === 0) {
      console.log('ℹ️  No files found in assets directory');
      return;
    }
    
    console.log(`📊 Found ${files.length} files to upload\n`);
    
    // Upload each file directly to root (no folder structure)
    const uploadPromises = files.map((filePath) => {
      return uploadFile(filePath);
    });
    
    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    const successfulUploads = results.filter(result => result !== null);
    
    console.log('\n--- Upload Summary ---');
    console.log(`✅ Successfully uploaded: ${successfulUploads.length}`);
    console.log(`❌ Failed uploads: ${results.length - successfulUploads.length}`);
    
    if (successfulUploads.length > 0) {
      console.log('\n📋 URLs of uploaded assets:');
      successfulUploads.forEach(url => console.log(`   ${url}`));
    }
    
  } catch (error) {
    console.error('❌ Error during upload process:', error.message);
  }
}

// CLI command handling
const args = process.argv.slice(2);

async function run() {
  if (args.includes('--delete-all')) {
    await deleteAllBlobs();
  } else if (args.includes('--list')) {
    await listAllBlobs();
  } else {
    await uploadAllAssets();
  }
  process.exit(0);
}