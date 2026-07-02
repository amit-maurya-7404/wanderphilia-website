const fs = require('fs');
const path = require('path');

function getPageFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getPageFiles(name, files_);
    } else if (name.endsWith('page.tsx')) {
      files_.push(name);
    }
  }
  return files_;
}

const pageFiles = getPageFiles('app/trips');
console.log(JSON.stringify(pageFiles, null, 2));
