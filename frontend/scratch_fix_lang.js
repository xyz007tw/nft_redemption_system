const fs = require('fs');
let file = 'components/ChatWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/language ===/g, 'lang ===');
content = content.replace(/language \}/g, 'language: lang }');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed lang references in ChatWidget.tsx');
