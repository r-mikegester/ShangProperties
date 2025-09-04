const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const IMAGE_IMPORT_REGEX = /import\s+(\w+)\s+from\s+["'](?:\.\/|\.\.\/|src\/)?assets\/imgs\/(.+?\.(?:webp|jpg|jpeg|png|svg|gif))["'];?/g;
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function guessReplacementVar(filepath) {
  // Guess the variable to use for image field based on file path
  const lc = filepath.toLowerCase();
  if (lc.includes('projectdetail') || lc.includes('project') || lc.includes('detail')) return 'project.image';
  if (lc.includes('featured') || lc.includes('list') || lc.includes('carousel')) return 'item.image';
  if (lc.includes('card') || lc.includes('gallery')) return 'item.image';
  return 'project.image'; // fallback
}

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let modified = false;
  let importMatches = [...content.matchAll(IMAGE_IMPORT_REGEX)];
  if (importMatches.length === 0) return;

  importMatches.forEach(match => {
    const [importStatement, varName] = match;
    // Remove import statement
    content = content.replace(importStatement + '\n', '');
    content = content.replace(importStatement, '');
    // Replace all usages of the variable with the guessed Firestore field
    const replacement = guessReplacementVar(filepath);
    const varUsageRegex = new RegExp(`(?<![.])\\b${varName}\\b`, 'g');
    content = content.replace(varUsageRegex, replacement);
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
  console.log('Local image import replacement with Firestore fields complete.');
}

main();
