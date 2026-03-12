const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Booking System');
console.log('='.repeat(30));

// Read the booking page
const bookingPath = path.join(__dirname, '../app/book-appointment/page.tsx');
let bookingContent = fs.readFileSync(bookingPath, 'utf8');

console.log('📋 Issues to fix:');
console.log('1. Style interface mismatch');
console.log('2. Missing proper style data handling');
console.log('3. Improve booking confirmation');
console.log('4. Add proper navigation after booking');

// Fix 1: Update Style interface to match the actual data
const oldInterface = `interface Style {
  id: string;
  name: string;
  category: 'hairstyle' | 'beard';
  images: string[];
  description: string;
  tags: string[];
  duration?: number;
  price?: number;
}`;

const newInterface = `interface Style {
  _id: string;
  id: string;
  name: string;
  category: 'hairstyle' | 'beard' | 'treatment' | 'coloring' | 'styling';
  image: string;
  description: string;
  tags: string[];
  price: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  maintenance: 'low' | 'medium' | 'high';
  suitability: string;
  whyItWorks: string;
}`;

bookingContent = bookingContent.replace(oldInterface, newInterface);

// Fix 2: Update the style creation logic to use proper data
const oldStyleCreation = `const styles = ids.map((id, index) => ({
        id,
        name: names[index] || \`Style \${index + 1}\`,
        category: 'hairstyle' as const,
        images: ['/api/placeholder/300/200'],
        description: 'Selected style from AI Style Advisor',
        tags: ['recommended'],
        duration: 30,
        price: 1500
      }));`;

const newStyleCreation = `const styles = ids.map((id, index) => ({
        _id: id,
        id: id,
        name: names[index] || \`Style \${index + 1}\`,
        category: 'hairstyle' as const,
        image: '/api/placeholder/300/200',
        description: 'Selected style from AI Style Advisor',
        tags: ['recommended'],
        price: 1500,
        duration: 30,
        difficulty: 'medium' as const,
        maintenance: 'medium' as const,
        suitability: '95%',
        whyItWorks: 'Recommended based on your face shape analysis'
      }));`;

bookingContent = bookingContent.replace(oldStyleCreation, newStyleCreation);

// Fix 3: Improve booking confirmation
const oldAlert = `alert('Appointment booked successfully!');`;
const newConfirmation = `// Show success message and redirect
      const successMessage = \`✅ Appointment booked successfully!\n\n📅 Date: \${selectedDate}\n⏰ Time: \${selectedTime}\n💇 Barber: \${selectedBarber.name}\n🏪 Salon: \${selectedSalon.name}\n💰 Total: ₹\${totalPrice}\n\nYou will receive a confirmation shortly.\`;
      
      if (confirm(successMessage)) {
        // Redirect to style advisor or confirmation page
        window.location.href = '/style-advisor';
      } else {
        // Stay on page or redirect to booking history
        window.location.href = '/style-advisor';
      }`;

bookingContent = bookingContent.replace(oldAlert, newConfirmation);

// Fix 4: Add proper style display with images
const oldStyleDisplay = `<div className="flex flex-wrap gap-2">
                  {selectedStyles.map((style, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {style.name}
                    </span>
                  ))}
                </div>`;

const newStyleDisplay = `<div className="space-y-3">
                  {selectedStyles.map((style, index) => (
                    <div key={style._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={style.image} 
                        alt={style.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/64/64';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{style.name}</h4>
                        <p className="text-sm text-gray-600">{style.category}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-blue-600">₹{style.price}</span>
                          <span className="text-sm text-gray-500">{style.duration}min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>`;

bookingContent = bookingContent.replace(oldStyleDisplay, newStyleDisplay);

// Write the updated content
fs.writeFileSync(bookingPath, bookingContent);

console.log('✅ Booking system fixed successfully!');
console.log('');
console.log('🎯 Improvements made:');
console.log('✅ Updated Style interface to match data structure');
console.log('✅ Fixed style creation with proper properties');
console.log('✅ Enhanced booking confirmation with details');
console.log('✅ Added style images and better display');
console.log('✅ Improved user experience with proper navigation');
console.log('');
console.log('🚀 Ready to test the booking system!');
