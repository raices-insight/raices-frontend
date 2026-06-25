import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Generic orchestration script for running Maestro E2E tests sequentially.
 * 
 * Usage: npx tsx scripts/run-maestro-dir.ts <relative-dir-path>
 */

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('❌ Please provide a target directory relative to the frontend root.');
  console.error('Example: npx tsx scripts/run-maestro-dir.ts e2e/01-auth');
  process.exit(1);
}

console.log(`📱 Launching Maestro E2E Suite for ${targetDir}...`);
const frontendDir = path.resolve(__dirname, '../');
const absoluteTargetDir = path.resolve(frontendDir, targetDir);

if (!fs.existsSync(absoluteTargetDir)) {
  console.error(`❌ Directory not found: ${absoluteTargetDir}`);
  process.exit(1);
}

// Read directory, filter for yaml files, and sort alphabetically
const files = fs.readdirSync(absoluteTargetDir)
  .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
  .sort();

if (files.length === 0) {
  console.log(`⚠️ No YAML files found in ${targetDir}`);
  process.exit(0);
}

for (const file of files) {
  console.log(`\n▶️ Running Flow: ${file}...`);
  execSync(`maestro test ${path.join(targetDir, file)}`, { cwd: frontendDir, stdio: 'inherit' });
}

console.log(`\n🎉 All E2E tests in ${targetDir} completed successfully!`);
