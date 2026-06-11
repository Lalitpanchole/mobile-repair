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
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Hex colors
    content = content.replace(/#2563EB/gi, '#F59E0B'); // Primary blue to Amber 500
    content = content.replace(/#06B6D4/gi, '#FBBF24'); // Cyan gradient to Amber 400
    content = content.replace(/#0EA5E9/gi, '#FBBF24'); // Secondary blue to Amber 400
    
    // Tailwind classes
    content = content.replace(/blue-500/g, 'amber-500');
    content = content.replace(/blue-600/g, 'amber-600');
    content = content.replace(/blue-400/g, 'amber-400');
    content = content.replace(/blue-700/g, 'amber-700');
    content = content.replace(/blue-800/g, 'amber-800');
    content = content.replace(/blue-900/g, 'amber-900');
    content = content.replace(/blue-50/g, 'amber-50');
    content = content.replace(/blue-100/g, 'amber-100');
    content = content.replace(/cyan-400/g, 'amber-300');
    content = content.replace(/cyan-300/g, 'amber-200');
    content = content.replace(/cyan-500/g, 'amber-400');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
