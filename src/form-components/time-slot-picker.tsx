"use client";

import React from "react";

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  bookedSlots?: string[]; // Array of already booked time slots
}

// Generate time slots from 8am to 6pm (Nepal Time) in 1-hour intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) { // 8am to 5pm (last slot is 5-6pm)
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    slots.push(timeStr);
  }
  return slots;
};

export default function TimeSlotPicker({ selectedDate, selectedTime, onTimeSelect, bookedSlots = [] }: TimeSlotPickerProps) {
  const timeSlots = generateTimeSlots();

  const formatTime = (time24: string) => {
    const [hour] = time24.split(':');
    const h = parseInt(hour);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:00 ${period}`;
  };

  const isSlotBooked = (slot: string) => bookedSlots.includes(slot);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        समय छान्नुहोस् (नेपाल समय - Nepal Time) <span className="text-rose-600">*</span>
      </label>
      {!selectedDate ? (
        <p className="text-sm text-gray-500 italic">पहिले मिति छान्नुहोस् (Please select a date first)</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {timeSlots.map((slot) => {
            const isBooked = isSlotBooked(slot);
            const isSelected = selectedTime === slot;
            
            return (
              <button
                key={slot}
                type="button"
                onClick={() => !isBooked && onTimeSelect(slot)}
                disabled={isBooked}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isBooked
                    ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-rose-400 hover:bg-rose-50'
                }`}
                title={isBooked ? 'यो समय बुक भइसकेको छ' : ''}
              >
                {formatTime(slot)}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        प्रत्येक परामर्श १ घण्टाको हुन्छ (Each consultation is 1 hour)
      </p>
    </div>
  );
}
