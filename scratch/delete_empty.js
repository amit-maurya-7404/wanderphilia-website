const fs = require('fs');
const path = require('path');

const emptyFolders = [
  'iceland',
  'indonesia',
  'japan',
  'meghalaya',
  'nepal',
  'peru',
  'switzerland'
];

emptyFolders.forEach(folder => {
  const folderPath = path.join('app', 'trips', folder);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Successfully deleted folder: ${folderPath}`);
  } else {
    console.log(`Folder not found or already deleted: ${folderPath}`);
  }
});
