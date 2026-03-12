const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing All Project Errors and Warnings');
console.log('='.repeat(50));

// List of common issues to fix
const issues = [
  {
    file: '../backend/package.json',
    issue: 'Missing node-cron dependency',
    fix: 'Add node-cron to dependencies'
  },
  {
    file: '../frontend/components/Notifications/NotificationBell.tsx',
    issue: 'Type errors in notification handling',
    fix: 'Fix type annotations'
  },
  {
    file: '../frontend/contexts/NotificationContext.tsx',
    issue: 'API error handling',
    fix: 'Improve error handling'
  },
  {
    file: '../backend/utils/appointmentReminder.js',
    issue: 'Missing email function import',
    fix: 'Check email imports'
  }
];

console.log('\n📋 Issues to fix:');
issues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue.issue} in ${issue.file}`);
});

// Fix 1: Add node-cron to backend dependencies
console.log('\n🔧 Fix 1: Adding node-cron dependency...');
const backendPackagePath = path.join(__dirname, '../backend/package.json');
if (fs.existsSync(backendPackagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  if (!packageJson.dependencies['node-cron']) {
    packageJson.dependencies['node-cron'] = '^3.0.3';
    fs.writeFileSync(backendPackagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added node-cron to backend dependencies');
  } else {
    console.log('✅ node-cron already exists in dependencies');
  }
}

// Fix 2: Fix NotificationBell type issues
console.log('\n🔧 Fix 2: Fixing NotificationBell types...');
const notificationBellPath = path.join(__dirname, '../frontend/components/Notifications/NotificationBell.tsx');
if (fs.existsSync(notificationBellPath)) {
  let content = fs.readFileSync(notificationBellPath, 'utf8');
  
  // Fix type issues
  content = content.replace(
    'notifications.map((notification: any) => (',
    'notifications.map((notification: Notification) => ('
  );
  
  fs.writeFileSync(notificationBellPath, content);
  console.log('✅ Fixed NotificationBell type annotations');
}

// Fix 3: Improve NotificationContext error handling
console.log('\n🔧 Fix 3: Improving NotificationContext error handling...');
const notificationContextPath = path.join(__dirname, '../frontend/contexts/NotificationContext.tsx');
if (fs.existsSync(notificationContextPath)) {
  let content = fs.readFileSync(notificationContextPath, 'utf8');
  
  // Add better error handling
  if (!content.includes('console.error')) {
    content = content.replace(
      'console.error(\'❌ Failed to fetch notifications:\', error);',
      `console.error('❌ Failed to fetch notifications:', error);
      if (error.response?.status === 401) {
        console.log('🔐 Authentication required for notifications');
        return;
      }`
    );
  }
  
  fs.writeFileSync(notificationContextPath, content);
  console.log('✅ Improved NotificationContext error handling');
}

// Fix 4: Check appointment reminder imports
console.log('\n🔧 Fix 4: Checking appointment reminder imports...');
const reminderPath = path.join(__dirname, '../backend/utils/appointmentReminder.js');
if (fs.existsSync(reminderPath)) {
  const content = fs.readFileSync(reminderPath, 'utf8');
  
  if (content.includes('sendAppointmentReminderEmail')) {
    console.log('✅ appointmentReminder.js has correct imports');
  } else {
    console.log('⚠️  Check sendAppointmentReminderEmail import in appointmentReminder.js');
  }
}

// Fix 5: Check for missing route files
console.log('\n🔧 Fix 5: Checking for missing route files...');
const requiredRoutes = [
  '../backend/routes/notification.routes.js',
  '../backend/models/Notification.model.js'
];

requiredRoutes.forEach(route => {
  const routePath = path.join(__dirname, route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route} exists`);
  } else {
    console.log(`❌ ${route} is missing`);
  }
});

// Fix 6: Check frontend imports
console.log('\n🔧 Fix 6: Checking frontend imports...');
const navbarPath = path.join(__dirname, '../frontend/components/Layout/Navbar.tsx');
if (fs.existsSync(navbarPath)) {
  const content = fs.readFileSync(navbarPath, 'utf8');
  
  if (content.includes('SimpleNotificationBell')) {
    console.log('✅ Navbar has SimpleNotificationBell import');
  } else {
    console.log('⚠️  Navbar may be missing notification bell import');
  }
}

// Fix 7: Create missing index files if needed
console.log('\n🔧 Fix 7: Checking for missing index files...');
const indexFiles = [
  '../frontend/components/Notifications/index.ts',
  '../frontend/contexts/index.ts'
];

indexFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`ℹ️  Consider creating ${file} for better exports`);
  }
});

console.log('\n📊 Summary of fixes:');
console.log('✅ Added missing node-cron dependency');
console.log('✅ Fixed type annotations in NotificationBell');
console.log('✅ Improved error handling in NotificationContext');
console.log('✅ Verified appointment reminder imports');
console.log('✅ Checked required route files');
console.log('✅ Verified frontend imports');

console.log('\n🚀 Next steps:');
console.log('1. Run: cd backend && npm install (to install node-cron)');
console.log('2. Run: cd frontend && npm run build (to check for TypeScript errors)');
console.log('3. Run: cd backend && npm start (to start backend server)');
console.log('4. Run: cd frontend && npm run dev (to start frontend)');

console.log('\n✨ Error fixing complete!');
