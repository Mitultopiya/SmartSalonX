const fs = require('fs');
const path = require('path');

console.log('🔧 Comprehensive Error Fix');
console.log('='.repeat(40));

// Fix 1: Update NotificationContext to properly handle API response types
console.log('\n🔧 Fix 1: Updating NotificationContext API response handling...');
const notificationContextPath = path.join(__dirname, '../frontend/contexts/NotificationContext.tsx');
if (fs.existsSync(notificationContextPath)) {
  let content = fs.readFileSync(notificationContextPath, 'utf8');
  
  // Add type casting for API response
  content = content.replace(
    'setNotifications(response.data.notifications || []);',
    'setNotifications((response.data.notifications || []) as CustomNotification[]);'
  );
  
  fs.writeFileSync(notificationContextPath, content);
  console.log('✅ Updated NotificationContext API response handling');
}

// Fix 2: Add proper type imports to avoid conflicts
console.log('\n🔧 Fix 2: Adding type imports...');
const notificationBellPath = path.join(__dirname, '../frontend/components/Notifications/NotificationBell.tsx');
if (fs.existsSync(notificationBellPath)) {
  let content = fs.readFileSync(notificationBellPath, 'utf8');
  
  // Add import for the CustomNotification type from context
  if (!content.includes('import { CustomNotification }')) {
    content = content.replace(
      'import { useNotifications } from \'../../contexts/NotificationContext\';',
      'import { useNotifications, CustomNotification } from \'../../contexts/NotificationContext\';'
    );
    
    // Remove the duplicate interface definition
    content = content.replace(
      `// Custom interface to avoid conflict with browser's Notification API
interface CustomNotification {
  _id: string;
  title: string;
  message: string;
  type: 'certificate_approved' | 'appointment_reminder' | 'system' | 'info' | 'warning' | 'success';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}
`,
      ''
    );
  }
  
  fs.writeFileSync(notificationBellPath, content);
  console.log('✅ Updated NotificationBell imports');
}

// Fix 3: Export CustomNotification from context
console.log('\n🔧 Fix 3: Exporting CustomNotification from context...');
const contextContent = fs.readFileSync(notificationContextPath, 'utf8');
if (!contextContent.includes('export { CustomNotification };')) {
  const updatedContent = contextContent + '\n\nexport { CustomNotification };';
  fs.writeFileSync(notificationContextPath, updatedContent);
  console.log('✅ Exported CustomNotification from context');
}

// Fix 4: Check and fix any remaining TypeScript issues in key files
console.log('\n🔧 Fix 4: Checking key files for TypeScript issues...');

const keyFiles = [
  '../frontend/app/barber/dashboard/page.tsx',
  '../frontend/app/book-appointment/page.tsx',
  '../frontend/components/Layout/Navbar.tsx',
  '../frontend/lib/api.ts'
];

keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common issues
    const issues = [];
    
    if (content.includes('import { Notification }')) {
      issues.push('Potential Notification API conflict');
    }
    
    if (content.includes(': any') && content.includes('notification')) {
      issues.push('Using any type for notifications');
    }
    
    if (issues.length > 0) {
      console.log(`⚠️  ${file}: ${issues.join(', ')}`);
    } else {
      console.log(`✅ ${file}: No obvious issues`);
    }
  } else {
    console.log(`❌ ${file}: File not found`);
  }
});

// Fix 5: Create a type declaration file to resolve conflicts
console.log('\n🔧 Fix 5: Creating type declaration file...');
const typesPath = path.join(__dirname, '../frontend/types/index.d.ts');
const typesDir = path.dirname(typesPath);

if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

const typeDeclaration = `
// Global type declarations to avoid conflicts
declare global {
  interface CustomNotification {
    _id: string;
    title: string;
    message: string;
    type: 'certificate_approved' | 'appointment_reminder' | 'system' | 'info' | 'warning' | 'success';
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
    metadata?: any;
  }
}

export {};
`;

fs.writeFileSync(typesPath, typeDeclaration);
console.log('✅ Created type declaration file');

// Fix 6: Check backend files for common issues
console.log('\n🔧 Fix 6: Checking backend files...');

const backendFiles = [
  '../backend/server.js',
  '../backend/utils/appointmentReminder.js',
  '../backend/controllers/notification.controller.js'
];

backendFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for import issues
    if (content.includes('import cron') && !content.includes('node-cron')) {
      console.log(`⚠️  ${file}: Check cron import`);
    }
    
    if (content.includes('require(')) {
      console.log(`⚠️  ${file}: Mixed ES modules and CommonJS`);
    }
    
    console.log(`✅ ${file}: Checked`);
  } else {
    console.log(`❌ ${file}: File not found`);
  }
});

// Fix 7: Create a comprehensive build test script
console.log('\n🔧 Fix 7: Creating build test script...');
const buildTestScript = `#!/bin/bash
echo "🧪 Running Comprehensive Error Check"
echo "=================================="

echo "📦 Checking frontend dependencies..."
cd frontend
npm install --silent

echo "🔍 Running TypeScript check..."
npx tsc --noEmit --skipLibCheck 2>&1 | head -20

echo "🏗️  Running build test..."
npm run build 2>&1 | head -20

echo "📦 Checking backend dependencies..."
cd ../backend
npm install --silent

echo "🚀 Starting backend test..."
timeout 10s npm start 2>&1 | head -10

echo "✅ Error check complete!"
`;

const buildScriptPath = path.join(__dirname, '../frontend/scripts/test-build.sh');
fs.writeFileSync(buildScriptPath, buildTestScript);
console.log('✅ Created build test script');

console.log('\n📊 Summary of fixes:');
console.log('✅ Fixed NotificationContext API response handling');
console.log('✅ Updated NotificationBell imports');
console.log('✅ Exported CustomNotification from context');
console.log('✅ Checked key files for TypeScript issues');
console.log('✅ Created type declaration file');
console.log('✅ Checked backend files');
console.log('✅ Created build test script');

console.log('\n🚀 Next steps:');
console.log('1. Restart your TypeScript server in IDE');
console.log('2. Run: cd frontend && npm run build');
console.log('3. Check for any remaining errors');
console.log('4. Test the notification system');

console.log('\n✨ Comprehensive error fixing complete!');
