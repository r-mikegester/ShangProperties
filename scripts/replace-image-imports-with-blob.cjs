const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const IMAGE_IMPORT_REGEX = /import\s+(\w+)\s+from\s+["'](?:\.\/|\.\.\/|src\/)?assets\/imgs\/(.+?\.(?:webp|jpg|jpeg|png|svg|gif))["'];?/g;
const IMAGE_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif'];
const BLOB_BASE_URL = 'https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/';

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(file))) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let modified = false;
  let importMatches = [...content.matchAll(IMAGE_IMPORT_REGEX)];
  if (importMatches.length === 0) return;

  importMatches.forEach(match => {
    const [importStatement, varName, imgPath] = match;
    const filename = path.basename(imgPath);
    const blobUrl = BLOB_BASE_URL + filename;
    // Remove import statement
    content = content.replace(importStatement + '\n', '');
    content = content.replace(importStatement, '');
    // Replace all usages of the variable with the blob URL
    // (only if not part of a property name)
    const varUsageRegex = new RegExp(`(?<![.])\\b${varName}\\b`, 'g');
    content = content.replace(varUsageRegex, `"${blobUrl}"`);
    modified = true;
  });

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated: ${filepath}`);
  }
}

function main() {
  const files = walk(SRC_DIR);
  files.forEach(processFile);
  console.log('Image import replacement complete.');
}

main();
