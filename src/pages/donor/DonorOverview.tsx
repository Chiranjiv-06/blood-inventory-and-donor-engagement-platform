import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  AlertOctagon,
  ArrowRight,
  Droplets,
  CalendarPlus,
  ShieldCheck,
  Building2,
  Sparkles,
  Award,
  Phone,
  Siren,
  CreditCard,
  QrCode,
  Download,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { DigitalDonorPassModal } from '../../components/common/DigitalDonorPassModal';

export const DonorOverview: React.FC = () => {
  const { currentUser, appointments, emergencyAlerts, bloodBanks, notifications, respondToEmergencyAlert } = useApp();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const activeEmergency = emergencyAlerts.find((a) => a.status === 'Open');
  const upcomingAppointment = appointments.find((a) => a.status === 'Confirmed');
  const recentNotifications = notifications.slice(0, 3);
  const topNearbyBanks = bloodBanks.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Donor Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white p-6 sm:p-8 shadow-xl shadow-red-500/15">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Gold Tier Life-Saver &bull; {currentUser.totalDonations ?? 8} Donations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser.name ? currentUser.name.split(' ')[0] : 'Donor'}! 👋
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Your last donation on {currentUser.lastDonationDate || 'May 18'} has helped save up to 3 patients. You are fully eligible for whole blood donation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-red-50 shadow-lg shadow-black/10 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-red-600" />
              Digital Donor Pass
            </button>
            <Link
              to="/donor/book"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-red-950/50 hover:bg-red-950/70 border border-white/20 shadow-lg transition-all text-xs sm:text-sm"
            >
              <CalendarPlus className="w-4 h-4 text-rose-300" />
              Book Donation
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner (when available) */}
      {activeEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950 to-slate-900 border-2 border-red-600/80 text-white shadow-lg animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white flex-shrink-0 mt-0.5 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Critical Emergency Appeal
                </span>
                <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded-full font-bold">
                  {activeEmergency.timeRemainingMinutes} mins remaining
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {activeEmergency.hospitalName} requires {activeEmergency.unitsRequired} units of {activeEmergency.bloodGroup} ({activeEmergency.component})
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeEmergency.reason} &bull; {activeEmergency.distanceKm} km away
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => respondToEmergencyAlert(activeEmergency.id, 'Accepted')}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
            >
              I Can Donate
            </button>
            <button
              onClick={() => respondToEmergencyAlert(activeEmergency.id, 'Declined')}
              className="px-3 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cannot Donate
            </button>
            <Link
              to="/donor/emergency-alerts"
              className="px-3 py-2 text-xs font-medium text-red-300 hover:text-white underline"
            >
              Details
            </Link>
          </div>
        </div>
      )}

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Group Card */}
        <Card className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900 border-red-200/80 dark:border-red-900/40">
          <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/25 flex-shrink-0">
            {currentUser.bloodGroup || 'O+'}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Blood Group
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Type {currentUser.bloodGroup || 'O+'}
            </h4>
            <span className="text-[11px] text-blood-600 dark:text-blood-400 font-semibold">
              Universal RBC / Target donor
            </span>
          </div>
        </Card>

        {/* Eligibility Status */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Eligibility Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="success" size="sm" dot>
                {currentUser.eligibilityStatus || 'Eligible'}
              </Badge>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Ready for whole blood
            </span>
          </div>
        </Card>

        {/* Next Donation Appointment */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Next Appointment
            </span>
            {upcomingAppointment ? (
              <>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {upcomingAppointment.date}
                </h4>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 truncate block">
                  {upcomingAppointment.timeSlot}
                </span>
              </>
            ) : (
              <>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">None booked</h4>
                <Link to="/donor/book" className="text-[11px] text-blood-600 hover:underline font-semibold">
                  Schedule one now &rarr;
                </Link>
              </>
            )}
          </div>
        </Card>

        {/* Total Donations Count */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Donations
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentUser.totalDonations ?? 8} Units
            </h4>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              ~{((currentUser.totalDonations ?? 8) * 3)} Lives Impacted ❤️
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Quick Actions
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" /> Digital Donor Pass
          </button>
          <Link
            to="/donor/book"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <CalendarPlus className="w-4 h-4 text-blood-600" /> Book Donation
          </Link>
          <Link
            to="/donor/eligibility"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Check Eligibility
          </Link>
          <Link
            to="/donor/history"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-500" /> Certificates & History
          </Link>
          <Link
            to="/donor/emergency-alerts"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-red-600" /> Urgent Appeals
          </Link>
        </div>
      </div>

      {/* Lower Dual Grid: Nearby Blood Banks & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Blood Banks preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Nearby Certified Blood Banks & Receiving Houses
            </h3>
            <Link
              to="/donor/nearby"
              className="text-xs font-semibold text-blood-600 dark:text-blood-400 hover:underline flex items-center gap-1"
            >
              View Map & All ({bloodBanks.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {topNearbyBanks.map((bank) => (
              <Card key={bank.id} className="p-4 hoverEffect">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{bank.name}</h4>
                      {bank.verified && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />{' '}
                      <span className="truncate">{bank.address}</span> &bull;{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                        {bank.distanceKm} km away
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      🕒 {bank.openingHours}
                    </p>
                  </div>

                  <Link
                    to="/donor/book"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-blood-600 hover:bg-blood-700 shadow-xs transition-all flex-shrink-0"
                  >
                    Book Here
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Recent Activity
            </h3>
            <Link
              to="/donor/notifications"
              className="text-xs font-semibold text-blood-600 dark:text-blood-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{notif.title}</span>
                  <span className="text-[10px] font-normal text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Donor Pass Modal */}
      <DigitalDonorPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
