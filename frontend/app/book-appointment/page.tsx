'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, Star, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { styleRecommendationAPI } from '@/lib/faceAnalysis';

interface Style {
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
}

interface Salon {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image?: string;
}

interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  price: number;
  image?: string;
}

export default function BookAppointmentPage() {
  const searchParams = useSearchParams();
  const styleIds = searchParams.get('styleIds');
  const styleNames = searchParams.get('styleNames');
  
  const [selectedStyles, setSelectedStyles] = useState<Style[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (styleIds && styleNames) {
      const ids = styleIds.split(',');
      const names = styleNames.split(',');
      const styles = ids.map((id, index) => ({
        _id: id,
        id: id,
        name: names[index] || `Style ${index + 1}`,
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
      }));
      setSelectedStyles(styles);
    }
    fetchSalons();
  }, [styleIds, styleNames]);

  const fetchSalons = async () => {
    try {
      // Mock salons - in real app, this would come from API
      const mockSalons = [
        {
          id: '1',
          name: 'Gentlemen\'s Grooming Studio',
          address: '123 Main Street, Downtown',
          rating: 4.8,
          distance: '2.5 km',
          image: '/salons/salon1.jpg'
        },
        {
          id: '2',
          name: 'Modern Cuts & Styles',
          address: '456 Oak Avenue, Westside',
          rating: 4.6,
          distance: '3.8 km',
          image: '/salons/salon2.jpg'
        }
      ];
      setSelectedSalon(mockSalons[0]);
    } catch (error) {
      console.error('Error fetching salons:', error);
    }
  };

  const handleSalonSelect = (salon: Salon) => {
    setSelectedSalon(salon);
    fetchBarbers(salon.id);
  };

  const fetchBarbers = async (salonId: string) => {
    try {
      // Mock barbers - in real app, this would come from API
      const mockBarbers = [
        {
          id: '1',
          name: 'Alex Johnson',
          specialty: 'Classic & Modern Styles',
          rating: 4.9,
          experience: '8 years',
          price: 1500,
          image: '/barbers/barber1.jpg'
        },
        {
          id: '2',
          name: 'Marcus Williams',
          specialty: 'Trendy Cuts & Beard Styling',
          rating: 4.7,
          experience: '6 years',
          price: 1200,
          image: '/barbers/barber2.jpg'
        }
      ];
      setSelectedBarber(mockBarbers[0]);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    fetchAvailableSlots(date);
  };

  const fetchAvailableSlots = async (date: string) => {
    try {
      // Mock time slots - in real app, this would come from API
      const mockSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ];
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleBooking = async () => {
    if (selectedStyles.length === 0 || !selectedSalon || !selectedBarber || !selectedDate || !selectedTime) {
      setBookingError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setBookingError('');
    
    try {
      // Check for collision prevention
      const slotKey = `${selectedDate}-${selectedTime}-${selectedBarber.id}-${selectedSalon.id}`;
      if (blockedSlots.has(slotKey)) {
        setBookingError('This time slot is currently being booked by another user. Please select a different time.');
        return;
      }

      // Block the slot for 30 minutes
      setBlockedSlots(prev => new Set(prev).add(slotKey));
      setTimeout(() => {
        setBlockedSlots(prev => {
          const newSet = new Set(prev);
          newSet.delete(slotKey);
          return newSet;
        });
      }, 30 * 60 * 1000); // 30 minutes

      // Create booking logic here
      const totalPrice = selectedStyles.reduce((sum, style) => sum + (style.price || 0), 0);
      const totalDuration = selectedStyles.reduce((sum, style) => sum + (style.duration || 30), 0);

      const bookingData = {
        styleIds: selectedStyles.map(s => s.id),
        styleNames: selectedStyles.map(s => s.name),
        salonId: selectedSalon.id,
        barberId: selectedBarber.id,
        date: selectedDate,
        time: selectedTime,
        totalPrice,
        totalDuration
      };

      console.log('Booking data:', bookingData);
      // Show success message and redirect
      const successMessage = `✅ Appointment booked successfully!

📅 Date: ${selectedDate}
⏰ Time: ${selectedTime}
💇 Barber: ${selectedBarber.name}
🏪 Salon: ${selectedSalon.name}
💰 Total: ₹${totalPrice}

You will receive a confirmation shortly.`;
      
      if (confirm(successMessage)) {
        // Redirect to style advisor or confirmation page
        window.location.href = '/style-advisor';
      } else {
        // Stay on page or redirect to booking history
        window.location.href = '/style-advisor';
      }
      // Redirect to payment or confirmation page
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNearbyDates = (currentDate: string) => {
    const date = new Date(currentDate);
    const nearbyDates = [];
    
    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + i);
      nearbyDates.push(nextDate.toISOString().split('T')[0]);
    }
    
    return nearbyDates;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = hour >= 12 ? 
          `${hour === 12 ? 12 : hour - 12}:${minute.toString().padStart(2, '0')} PM` :
          `${hour}:${minute.toString().padStart(2, '0')} AM`;
        slots.push({ value: time, display: displayTime });
      }
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/style-advisor" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              Back to Style Advisor
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selected Styles */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Selected Styles</h2>
              
              {selectedStyles.length > 0 ? (
                <div className="space-y-4">
                  {selectedStyles.map((style, index) => (
                    <div key={style._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <img 
                          src={style.image} 
                          alt={style.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/64/64';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{style.name}</h3>
                          <p className="text-sm text-gray-600">{style.category} • {style.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">{style.duration} min</span>
                            <span className="font-bold text-blue-600">₹{style.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-medium">
                        {selectedStyles.reduce((sum, style) => sum + (style.duration || 30), 0)} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">Total Price:</span>
                      <span className="font-bold text-lg text-blue-600">
                        ₹{selectedStyles.reduce((sum, style) => sum + (style.price || 1500), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No styles selected</p>
                  <Link 
                    href="/style-advisor"
                    className="inline-block mt-3 text-blue-600 hover:text-blue-700"
                  >
                    Find your style
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Selection - Priority 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Date & Time</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {generateTimeSlots().map((slot) => (
                        <button
                          key={slot.value}
                          onClick={() => setSelectedTime(slot.value)}
                          disabled={blockedSlots.has(`${selectedDate}-${slot.value}`)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            selectedTime === slot.value
                              ? 'bg-blue-600 text-white border-blue-600'
                              : blockedSlots.has(`${selectedDate}-${slot.value}`)
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {blockedSlots.has(`${selectedDate}-${slot.value}`) ? 'Busy' : slot.display}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Salon Selection - Priority 2 */}
            {selectedDate && selectedTime && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Salon</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: '1',
                      name: 'Gentlemen\'s Grooming Studio',
                      address: '123 Main Street, Downtown',
                      rating: 4.8,
                      distance: '2.5 km'
                    },
                    {
                      id: '2',
                      name: 'Modern Cuts & Styles',
                      address: '456 Oak Avenue, Westside',
                      rating: 4.6,
                      distance: '3.8 km'
                    }
                  ].map((salon) => (
                    <div
                      key={salon.id}
                      onClick={() => handleSalonSelect(salon)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSalon?.id === salon.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{salon.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{salon.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{salon.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{salon.distance}</span>
                          </div>
                        </div>
                        {selectedSalon?.id === salon.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barber Selection - Priority 3 */}
            {selectedDate && selectedTime && selectedSalon && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Barber</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: '1',
                      name: 'Alex Johnson',
                      specialty: 'Classic & Modern Styles',
                      rating: 4.9,
                      experience: '8 years',
                      price: 1500
                    },
                    {
                      id: '2',
                      name: 'Marcus Williams',
                      specialty: 'Trendy Cuts & Beard Styling',
                      rating: 4.7,
                      experience: '6 years',
                      price: 1200
                    }
                  ].map((barber) => {
                    const isBarberBusy = blockedSlots.has(`${selectedDate}-${selectedTime}-${barber.id}-${selectedSalon?.id}`);
                    return (
                      <div
                        key={barber.id}
                        onClick={() => !isBarberBusy && setSelectedBarber(barber)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedBarber?.id === barber.id
                            ? 'border-blue-500 bg-blue-50'
                            : isBarberBusy
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{barber.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{barber.specialty}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{barber.rating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{barber.experience}</span>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm font-medium text-blue-600">₹{barber.price}</span>
                              {isBarberBusy && (
                                <span className="ml-2 text-xs text-red-600 font-medium">Busy</span>
                              )}
                            </div>
                          </div>
                          {selectedBarber?.id === barber.id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Suggest alternatives if all barbers are busy */}
                {selectedDate && selectedTime && selectedSalon && 
                 ['1', '2'].every(barberId => blockedSlots.has(`${selectedDate}-${selectedTime}-${barberId}-${selectedSalon.id}`)) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">All Barbers Busy</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          All barbers at {selectedSalon.name} are busy at {selectedTime} on {selectedDate}.
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-yellow-700 text-sm font-medium">Suggestions:</p>
                          <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Try a different time on {selectedDate}</li>
                            <li>• Try {selectedSalon.name} on nearby dates</li>
                            <li>• Consider other salons in your area</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggest alternatives if entire salon is busy */}
                {selectedDate && selectedTime && 
                 ['1', '2'].every(salonId => 
                  ['1', '2'].every(barberId => blockedSlots.has(`${selectedDate}-${selectedTime}-${barberId}-${salonId}`))
                 ) && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800">All Salons Busy</h4>
                        <p className="text-orange-700 text-sm mt-1">
                          All salons are busy at {selectedTime} on {selectedDate}.
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-orange-700 text-sm font-medium">Try these alternatives:</p>
                          <ul className="text-orange-700 text-sm space-y-1">
                            <li>• Different times on {selectedDate}</li>
                            <li>• Nearby dates: {getNearbyDates(selectedDate).join(', ')}</li>
                            <li>• Consider evening slots for better availability</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Booking Error</h4>
                    <p className="text-red-700 text-sm mt-1">{bookingError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={handleBooking}
                disabled={loading || selectedStyles.length === 0 || !selectedSalon || !selectedBarber || !selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-3">
                By booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
