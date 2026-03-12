# Salon Management System - Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret key
- Razorpay credentials
- Google Maps API key

4. Create uploads directory:
```bash
mkdir -p uploads/certificates
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Salons
- `GET /api/salons` - Get all salons
- `GET /api/salons/nearby` - Get nearby salons (requires lat, lng)
- `GET /api/salons/:id` - Get salon by ID

### Appointments
- `GET /api/appointments/slots` - Get available time slots
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `POST /api/appointments/:id/review` - Add review

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund/:appointmentId` - Process refund

### Barber
- `POST /api/barbers/register` - Register as barber
- `GET /api/barbers/profile` - Get barber profile
- `PUT /api/barbers/working-hours` - Update working hours

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/barbers/pending` - Get pending barber registrations
- `PUT /api/admin/barbers/:id/approve` - Approve barber
- `POST /api/admin/commissions/release` - Release commissions

## Database Models

- User
- Barber
- Salon
- Appointment
- Hairstyle
- Wallet
- Commission
