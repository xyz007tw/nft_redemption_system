const fs = require('fs');
let file = 'components/ChatWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

// The backslashes were literally written into the file
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed backslashes in ChatWidget.tsx');
