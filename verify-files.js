// Quick verification script
const fs = require('fs');
const path = require('path');

const files = [
  'lib/game/disasterScenarios.ts',
  'lib/game/reactionTimer.ts',
  'lib/contracts/abis.ts',
  'lib/contracts/addresses.ts',
  'lib/constants.ts',
];

console.log('Checking files...\n');
files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});
