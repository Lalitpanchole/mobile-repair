import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace dark mode text colors for better visibility (whiter colors)
    content = content.replace(/dark:text-\[\#F3F4F6\]/g, 'dark:text-white');
    content = content.replace(/dark:text-gray-300/g, 'dark:text-gray-100');
    content = content.replace(/dark:text-gray-400/g, 'dark:text-gray-200');
    content = content.replace(/dark:text-gray-500/g, 'dark:text-gray-300');
    content = content.replace(/dark:text-gray-800/g, 'dark:text-gray-200'); // Some places might mistakenly use gray-800 in dark mode

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated dark text colors in: ' + filePath);
    }
  }
});
