import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Salon from '../models/Salon.model.js';
import User from '../models/User.model.js';

dotenv.config();

/**
 * Import salons from Google Places Text Search API for a list of Indian cities.
 *
 * Why: This seeds "real-world" salon data into MongoDB so your app can show actual salons.
 * Note: Google Places requires billing + enabled Places API.
 *
 * Usage:
 *   node scripts/import_salons_google_places.js
 *
 * Configure:
 *   GOOGLE_PLACES_API_KEY in backend .env
 */

const DEFAULT_CITIES = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Patna',
  'Vadodara',
  'Ludhiana',
  'Agra',
  'Nashik',
];

function guessGenderServices(placeName = '') {
  const n = placeName.toLowerCase();
  if (n.includes('parlour') || n.includes('parlor') || n.includes('beauty')) return ['female', 'unisex'];
  if (n.includes('barber')) return ['male', 'unisex'];
  return ['unisex'];
}

async function ensureSystemOwner() {
  // Create a dedicated owner user for imported salons (so ownerId is valid).
  const email = 'system-owner@salonpro.local';
  let owner = await User.findOne({ email });
  if (!owner) {
    owner = await User.create({
      name: 'System Owner',
      email,
      password: 'systemowner123',
      phone: '0000000000',
      role: 'admin',
    });
  }
  return owner;
}

async function googlePlacesTextSearch({ query, apiKey, pagetoken }) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', apiKey);
  if (pagetoken) url.searchParams.set('pagetoken', pagetoken);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Google Places HTTP ${res.status}`);
  return await res.json();
}

async function run() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) in backend .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_management');
  console.log('✅ MongoDB Connected');

  const owner = await ensureSystemOwner();

  const cities = process.env.GOOGLE_PLACES_CITIES
    ? process.env.GOOGLE_PLACES_CITIES.split(',').map((c) => c.trim()).filter(Boolean)
    : DEFAULT_CITIES;

  let inserted = 0;
  let updated = 0;

  for (const city of cities) {
    console.log(`\n🔎 Importing for city: ${city}`);
    const query = `salon near ${city}, India`;

    let nextPageToken = null;
    for (let page = 0; page < 3; page++) {
      // Google requires ~2s delay before using next_page_token
      if (nextPageToken) {
        await new Promise((r) => setTimeout(r, 2200));
      }

      const data = await googlePlacesTextSearch({ query, apiKey, pagetoken: nextPageToken });
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.log(`⚠️ Google Places status for ${city}: ${data.status}`, data.error_message || '');
        break;
      }

      const results = data.results || [];
      for (const p of results) {
        const placeId = p.place_id;
        const name = p.name;
        const location = p.geometry?.location;
        if (!placeId || !name || !location?.lat || !location?.lng) continue;

        const genderServices = guessGenderServices(name);
        const street = p.formatted_address || '';

        const doc = {
          name,
          ownerId: owner._id,
          address: {
            street,
            city,
            state: '',
            pincode: '',
            coordinates: {
              lat: location.lat,
              lng: location.lng,
            },
          },
          phone: 'NA',
          email: '',
          genderServices,
          images: p.photos?.length ? [] : [],
          rating: {
            average: p.rating || 0,
            count: p.user_ratings_total || 0,
          },
          status: 'active',
          // Store Google placeId for dedupe
          googlePlaceId: placeId,
        };

        const existing = await Salon.findOne({ googlePlaceId: placeId });
        if (existing) {
          await Salon.updateOne({ _id: existing._id }, { $set: doc });
          updated++;
        } else {
          await Salon.create(doc);
          inserted++;
        }
      }

      nextPageToken = data.next_page_token || null;
      if (!nextPageToken) break;
    }
  }

  console.log(`\n✅ Import finished. Inserted: ${inserted}, Updated: ${updated}`);
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Import failed:', e);
  process.exit(1);
});

