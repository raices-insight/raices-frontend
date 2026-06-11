import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Orchestration script for running Family E2E tests with database reset.
 * 
 * This script ensures tests are run in a safe, non-production environment.
 * It seeds the necessary backend microservices to guarantee idempotency.
 */

console.log('🛡️  Verifying Environment Safety...');

// 1. Safety Check: Ensure we aren't pointing to a production environment
const envPath = path.resolve(__dirname, '../.env');
let isProd = false;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('EXPO_PUBLIC_IS_PROD=true')) {
    isProd = true;
  }
}

// Also check process.env in case it's injected by CI
if (isProd || process.env.EXPO_PUBLIC_IS_PROD === 'true') {
  console.error('\n❌ CRITICAL ERROR: EXPO_PUBLIC_IS_PROD is set to true!');
  console.error('Cannot run E2E database reset scripts against a production environment. Exiting.');
  process.exit(1);
}

console.log('✅ Environment safe (Development/Testing). Proceeding with database reset...\n');

try {
  // 2. Reset Auth Service Database
  console.log('🔄 Seeding Auth Service...');
  const authServiceDir = path.resolve(__dirname, '../../raices-auth-service');
  execSync('npm run db:seed', { cwd: authServiceDir, stdio: 'inherit' });
  console.log('✅ Auth Service Seeded.\n');

  // 3. Reset Family Service Database
  console.log('🔄 Seeding Family Service...');
  const familyServiceDir = path.resolve(__dirname, '../../raices-family-service');
  execSync('npm run seed', { cwd: familyServiceDir, stdio: 'inherit' });
  console.log('✅ Family Service Seeded.\n');

  // 4. Run Maestro Tests
  console.log('📱 Launching Maestro Family E2E Suite...');
  const frontendDir = path.resolve(__dirname, '../');
  execSync('maestro test e2e/02-family/', { cwd: frontendDir, stdio: 'inherit' });
  
  console.log('\n🎉 All E2E Family tests completed successfully!');

} catch (error: any) {
  console.error('\n❌ E2E Orchestration Failed!');
  console.error(error.message);
  process.exit(1);
}
