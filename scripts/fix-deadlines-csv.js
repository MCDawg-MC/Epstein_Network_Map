const fs = require('fs');
const path = require('path');

// Path to the original CSV
const inputPath = path.join('c:', 'Users', 'mitch', 'Downloads', 'College Application APP', 'deadlines.csv');
const outputPath = path.join('c:', 'Users', 'mitch', 'Downloads', 'College Application APP', 'deadlines_fixed.csv');

// Read and parse CSV
const csvContent = fs.readFileSync(inputPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

// Track counts for duplicates
const counts = {};
const outputLines = [headers.join(',') + ',priority'];

// Process each line
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const schoolKey = parts[0];
  const cycleLabel = parts[1];
  const plan = parts[2];

  const key = `${schoolKey}|${cycleLabel}|${plan}`;
  counts[key] = (counts[key] || 0) + 1;

  outputLines.push(lines[i] + ',' + counts[key]);
}

// Write fixed CSV
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');

// Count duplicates
const duplicateCount = Object.values(counts).filter(v => v > 1).length;

console.log(`✅ Created deadlines_fixed.csv`);
console.log(`📊 Total rows: ${lines.length - 1}`);
console.log(`🔁 Schools with multiple deadlines per plan: ${duplicateCount}`);
console.log(`📍 Output: ${outputPath}`);
