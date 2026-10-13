const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'planner.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const newMembers = [
  {
    id: 'm-09',
    name: "God'stime Okoruwa",
    relationship: '7th Sibling • Son',
    branch: 'General / Family Member',
    phone: '09165955052',
    email: 'godstime.okoruwa@gmail.com',
    assignedRole: 'Logistics and Family Protocol',
    loginCode: '261008',
    status: 'Active',
    permission: 'view_only',
    createdAt: '2026-10-04',
    notes: 'Active family member with view-only planning access.'
  },
  {
    id: 'm-10',
    name: 'Gladys Okoruwa',
    relationship: '8th Sibling • Daughter',
    branch: 'General / Family Member',
    phone: '08036514093',
    email: 'gladys.okoruwa@gmail.com',
    assignedRole: 'Guest Hospitality and Reception Protocol',
    loginCode: '261009',
    status: 'Active',
    permission: 'view_only',
    createdAt: '2026-10-04',
    notes: 'Active family member with view-only planning access.'
  }
];

if (!db.familyMembers) db.familyMembers = [];

for (const m of newMembers) {
  const exists = db.familyMembers.some(
    (x) => x.name.toLowerCase() === m.name.toLowerCase() || x.loginCode === m.loginCode || x.phone === m.phone
  );
  if (!exists) {
    db.familyMembers.push(m);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated planner.json with God\'stime and Gladys. Total members:', db.familyMembers.length);
