import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BloodComponent } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Heart,
  Droplet,
  MapPin,
  Download,
  CalendarCheck,
} from 'lucide-react';

export const BookDonation: React.FC = () => {
  const { currentUser, bloodBanks, bookAppointment } = useApp();
  const navigate = useNavigate();

  const [selectedBankId, setSelectedBankId] = useState(bloodBanks[0]?.id || 'bb_1');
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM - 11:15 AM');
  const [donationType, setDonationType] = useState<BloodComponent>('Whole Blood');
  const [notes, setNotes] = useState('Online scheduled donation. Standard check-in.');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const timeSlots = [
    '08:30 AM - 09:15 AM',
    '09:30 AM - 10:15 AM',
    '10:30 AM - 11:15 AM',
    '11:30 AM - 12:15 PM',
    '01:30 PM - 02:15 PM',
    '02:30 PM - 03:15 PM',
    '04:00 PM - 04:45 PM',
    '05:00 PM - 05:45 PM',
  ];

  const selectedBank = bloodBanks.find((b) => b.id === selectedBankId) || bloodBanks[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingPayload = {
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorBloodGroup: currentUser.bloodGroup || 'O+',
      donorPhone: currentUser.phone,
      bloodBankId: selectedBank.id,
      bloodBankName: selectedBank.name,
      bloodBankAddress: selectedBank.address,
      date: selectedDate,
      timeSlot: selectedSlot,
      donationType,
      status: 'Confirmed' as const,
      notes,
    };

    bookAppointment(bookingPayload);
    setConfirmedBooking(bookingPayload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Schedule a Blood Donation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Select a verified transfusion facility, preferred time slot, and donation type.
        </p>
      </div>

      {!confirmedBooking ? (
        <form onSubmit={handleConfirm} className="space-y-6">
          {/* Step 1: Choose Blood Bank */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blood-600" />
              1. Select Blood Bank or Collection Center
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bloodBanks.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blood-600 bg-red-50/50 dark:bg-red-950/30 ring-2 ring-blood-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {bank.name}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blood-600 dark:text-blood-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {bank.address} &bull; {bank.distanceKm} km
                    </p>
                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <span className="text-slate-400">🕒 {bank.openingHours}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ⭐ {bank.rating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Step 2: Date and Time Slot */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              2. Select Date and Available Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Donation Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Available Fast-Track Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{slot}</span>
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3: Donation Type */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600" />
              3. Donation Component Type
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  type: 'Whole Blood' as BloodComponent,
                  desc: 'Most common ~450ml draw. Takes ~15 mins. Saves 3 lives.',
                },
                {
                  type: 'Platelets' as BloodComponent,
                  desc: 'Apheresis harvest for cancer & trauma patients. Takes ~60 mins.',
                },
                {
                  type: 'Fresh Frozen Plasma' as BloodComponent,
                  desc: 'Provides clotting factors and burn therapy. Takes ~45 mins.',
                },
              ].map((c) => (
                <div
                  key={c.type}
                  onClick={() => setDonationType(c.type)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    donationType === c.type
                      ? 'border-blood-600 bg-red-50/60 dark:bg-red-950/40 ring-2 ring-blood-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.type}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Special Requests or Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. First-time platelet donor, prefer left arm..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              />
            </div>
          </Card>

          {/* Submission Action */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/donor')}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-lg shadow-red-500/25 transition-all"
            >
              <CalendarCheck className="w-5 h-5" />
              Confirm Booking & Issue Token
            </button>
          </div>
        </form>
      ) : (
        /* Confirmation Success View */
        <Card className="p-8 sm:p-10 text-center animate-slide-up border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <Badge variant="success" size="lg" dot className="mb-2">
            Appointment Confirmed
          </Badge>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Thank You for Scheduling Your Donation!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
            Your fast-track priority token has been registered with{' '}
            <strong>{confirmedBooking.bloodBankName}</strong>. Please bring a valid photo ID.
          </p>

          {/* Ticket pass summary card */}
          <div className="max-w-md mx-auto my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">Digital Pass Token:</span>
              <span className="font-mono font-black text-blood-600 dark:text-blood-400">
                BL-TOK-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Center:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {confirmedBooking.bloodBankName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                {confirmedBooking.bloodBankAddress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Scheduled Date & Time:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {confirmedBooking.date} &bull; {confirmedBooking.timeSlot}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Donation Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {confirmedBooking.donationType} ({currentUser.bloodGroup || 'O+'})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => alert('Fast-Track Donation Pass Token downloaded as PDF.')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" /> Download Digital Pass
            </button>
            <Link
              to="/donor/appointments"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md text-xs sm:text-sm"
            >
              View in My Appointments &rarr;
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};
