const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'build');
const outputFile = path.join(dirPath, 'index.d.ts');

fs.readdir(dirPath, (err, files) => {
  if (err) throw err;

  const dtsFiles = files.filter(
    (file) => file.endsWith('.d.ts') && file !== 'index.d.ts'
  );

  let combinedContent = '';

  dtsFiles.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    combinedContent += `\n// File: ${file}\n` + content;
  });

  fs.writeFileSync(outputFile, combinedContent, 'utf-8');

  // Remove individual files
  dtsFiles.forEach((file) => {
    fs.unlinkSync(path.join(dirPath, file));
  });

  console.log(`Combined declaration files into ${outputFile}`);
});
