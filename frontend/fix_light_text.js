import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/pages', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace dark:text-white with dark:text-gray-300 ONLY in h1 tags 
    // to make the headings "light" but not pure white.
    content = content.replace(/<h1([^>]*)dark:text-white/g, '<h1$1dark:text-gray-300');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated to light color in: ' + filePath);
    }
  }
});
