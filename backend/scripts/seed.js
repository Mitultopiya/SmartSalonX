import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Salon from '../models/Salon.model.js';
import Barber from '../models/Barber.model.js';
import Hairstyle from '../models/Hairstyle.model.js';
import Wallet from '../models/Wallet.model.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_management');

    // Clear existing data
    await User.deleteMany({});
    await Salon.deleteMany({});
    await Barber.deleteMany({});
    await Hairstyle.deleteMany({});
    await Wallet.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'dolph17wwe@gmail.com',
      password: 'Admin@123',
      phone: '9999999999',
      role: 'admin',
    });
    console.log('✅ Admin created');

    // Create Sample Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      phone: '9876543210',
      role: 'user',
      gender: 'male',
      rewardPoints: 50,
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      phone: '9876543211',
      role: 'user',
      gender: 'female',
      rewardPoints: 100,
    });
    console.log('✅ Sample users created');

    // Create Salon Owner
    const salonOwner = await User.create({
      name: 'Salon Owner',
      email: 'owner@salon.com',
      password: 'owner123',
      phone: '9876543212',
      role: 'barber',
    });

    // Create Salons
    const salon1 = await Salon.create({
      name: 'Elite Hair Studio',
      ownerId: salonOwner._id,
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: {
          lat: 19.0760,
          lng: 72.8777,
        },
      },
      phone: '022-12345678',
      email: 'elite@salon.com',
      genderServices: ['male', 'female', 'unisex'],
      openingHours: {
        monday: { start: '09:00', end: '20:00', isOpen: true },
        tuesday: { start: '09:00', end: '20:00', isOpen: true },
        wednesday: { start: '09:00', end: '20:00', isOpen: true },
        thursday: { start: '09:00', end: '20:00', isOpen: true },
        friday: { start: '09:00', end: '20:00', isOpen: true },
        saturday: { start: '09:00', end: '20:00', isOpen: true },
        sunday: { start: '10:00', end: '18:00', isOpen: true },
      },
      rating: { average: 4.5, count: 25 },
      status: 'active',
    });

    const salon2 = await Salon.create({
      name: 'Glamour Parlour',
      ownerId: salonOwner._id,
      address: {
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        coordinates: {
          lat: 28.6139,
          lng: 77.2090,
        },
      },
      phone: '011-87654321',
      email: 'glamour@salon.com',
      genderServices: ['female', 'unisex'],
      openingHours: {
        monday: { start: '10:00', end: '19:00', isOpen: true },
        tuesday: { start: '10:00', end: '19:00', isOpen: true },
        wednesday: { start: '10:00', end: '19:00', isOpen: true },
        thursday: { start: '10:00', end: '19:00', isOpen: true },
        friday: { start: '10:00', end: '19:00', isOpen: true },
        saturday: { start: '10:00', end: '19:00', isOpen: true },
        sunday: { start: '11:00', end: '17:00', isOpen: false },
      },
      rating: { average: 4.8, count: 40 },
      status: 'active',
    });
    console.log('✅ Salons created');

    // Create Barber
    const barberUser = await User.create({
      name: 'Mike Barber',
      email: 'barber@salon.com',
      password: 'barber123',
      phone: '9876543213',
      role: 'barber',
    });

    const barber = await Barber.create({
      userId: barberUser._id,
      salonId: salon1._id,
      specialization: ['haircut', 'styling', 'beard'],
      experience: 5,
      workingHours: {
        monday: { start: '09:00', end: '18:00', isWorking: true },
        tuesday: { start: '09:00', end: '18:00', isWorking: true },
        wednesday: { start: '09:00', end: '18:00', isWorking: true },
        thursday: { start: '09:00', end: '18:00', isWorking: true },
        friday: { start: '09:00', end: '18:00', isWorking: true },
        saturday: { start: '09:00', end: '18:00', isWorking: true },
        sunday: { start: '10:00', end: '16:00', isWorking: false },
      },
      rating: { average: 4.7, count: 15 },
      status: 'approved',
      approvedBy: admin._id,
      approvedAt: new Date(),
    });

    await Wallet.create({
      userId: barberUser._id,
      availableBalance: 5000,
      blockedCommission: 500,
      totalEarnings: 10000,
    });
    console.log('✅ Barbers created');

    // Create Hairstyles
    const hairstyles = [
      {
        name: 'Classic Haircut',
        description: 'Traditional men\'s haircut',
        gender: 'male',
        duration: 30,
        price: 300,
        category: 'haircut',
      },
      {
        name: 'Fade Cut',
        description: 'Modern fade haircut',
        gender: 'male',
        duration: 45,
        price: 500,
        category: 'haircut',
      },
      {
        name: 'Women\'s Haircut',
        description: 'Professional women\'s haircut',
        gender: 'female',
        duration: 45,
        price: 600,
        category: 'haircut',
      },
      {
        name: 'Hair Styling',
        description: 'Professional hair styling',
        gender: 'unisex',
        duration: 60,
        price: 800,
        category: 'styling',
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service',
        gender: 'unisex',
        duration: 120,
        price: 2000,
        category: 'coloring',
      },
      {
        name: 'Facial Treatment',
        description: 'Deep cleansing facial',
        gender: 'female',
        duration: 60,
        price: 1000,
        category: 'facial',
      },
    ];

    await Hairstyle.insertMany(hairstyles);
    console.log('✅ Hairstyles created');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: dolph17wwe@gmail.com / Admin@123');
    console.log('User: john@example.com / user123');
    console.log('Barber: barber@salon.com / barber123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();