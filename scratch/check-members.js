const fs = require('fs');
const content = fs.readFileSync('./app/data/initialData.ts', 'utf8');

// Extract member blocks
const membersIdx = content.indexOf('export const initialFamilyMembers');
const membersBlock = content.slice(membersIdx);

const names = [...membersBlock.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
const phones = [...membersBlock.matchAll(/phone:\s*"([^"]+)"/g)].map(m => m[1]);
const codes = [...membersBlock.matchAll(/loginCode:\s*"([^"]+)"/g)].map(m => m[1]);
const perms = [...membersBlock.matchAll(/permission:\s*"([^"]+)"/g)].map(m => m[1]);

console.log('Found', names.length, 'members:');
names.forEach((name, i) => {
  console.log(`${i+1}. ${name} | Phone: ${phones[i]} | Code: ${codes[i]} | Permission: ${perms[i]}`);
});
