const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.includes('scratch')) {
        files = files.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
        files.push(file);
      }
    }
  });
  return files;
}

const files = walk('.');
const ids = ['10', '11', '12', '13', '14'];
files.forEach(f => {
  if (f.includes('lib/data.ts') || f.includes('lib\\data.ts')) return;
  const content = fs.readFileSync(f, 'utf8');
  ids.forEach(id => {
    // Check if the id is used as a string literal 'id' or "id"
    const regex = new RegExp(`['"]${id}['"]`, 'g');
    if (regex.test(content)) {
      console.log(`Found ID "${id}" in ${f}`);
    }
  });
});
