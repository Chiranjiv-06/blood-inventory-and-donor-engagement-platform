import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { DigitalDonorPassModal } from '../../components/common/DigitalDonorPassModal';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  ShieldCheck,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
  Download,
} from 'lucide-react';
import { BloodGroup } from '../../types';

export const DonorProfile: React.FC = () => {
  const { currentUser, updateCurrentUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup || 'O+');
  const [dob, setDob] = useState(currentUser.dob || '1994-06-15');
  const [gender, setGender] = useState(currentUser.gender || 'Male');
  const [address, setAddress] = useState(currentUser.address || '742 Evergreen Terrace, Springfield');
  const [location, setLocation] = useState(currentUser.location || 'Metro Central, Zone 4');
  const [emergencyContactName, setEmergencyContactName] = useState(currentUser.emergencyContact?.name || 'Sarah Mitchell');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(currentUser.emergencyContact?.phone || '+1 (555) 987-6543');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      email,
      phone,
      bloodGroup,
      dob,
      gender: gender as any,
      address,
      location,
      emergencyContact: {
        name: emergencyContactName,
        relationship: 'Emergency Contact',
        phone: emergencyContactPhone,
      },
    });
    setIsEditing(false);
  };

  // Profile completion calculation
  const fields = [name, email, phone, bloodGroup, dob, gender, address, emergencyContactName, emergencyContactPhone];
  const filledFields = fields.filter(Boolean).length;
  const completionPercent = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Donor Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your verified medical and contact details for seamless transfusion check-ins and digital pass generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPassModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Digital Donor Pass
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isEditing
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-850 text-white border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Profile Completion & Verification</h3>
              <p className="text-xs text-slate-400">
                100% complete profiles receive instant fast-track access at all partner blood banks.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">{completionPercent}%</span>
            <span className="text-xs text-slate-400 block">Completed</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </Card>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Avatar and Blood Group Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="text-center p-6">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full rounded-3xl border-4 border-slate-100 dark:border-slate-800 shadow-lg bg-gradient-to-br from-blood-600 to-rose-700 flex items-center justify-center text-white text-3xl font-black">
                  {currentUser.name
                    ? currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'BL'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  {currentUser.bloodGroup || 'O+'}
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.location}</p>

              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge variant="blood" size="sm" dot>
                  Type {currentUser.bloodGroup || 'O+'}
                </Badge>
                <Badge variant="success" size="sm">
                  Verified Donor
                </Badge>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Donor ID:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {currentUser.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Receiving House:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]" title="Metropolitan Red Cross Central Bank">
                    Metro Red Cross Bank
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Donation:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentUser.lastDonationDate || '2026-05-18'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Next Eligible:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {currentUser.nextEligibleDate || 'Eligible Now'}
                  </span>
                </div>
              </div>

              {/* Instant View Digital Pass Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-blood-600 dark:text-blood-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" /> View Digital E-Pass
                </button>
              </div>
            </Card>
          </div>

          {/* Right Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blood-600" /> Personal & Medical Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    disabled={!isEditing}
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  >
                    {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    disabled={!isEditing}
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Mobile Phone
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Residential Address & City Zone
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-850 focus:ring-2 focus:ring-blood-500 focus:outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Profile Details
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </form>

      {/* Digital Donor Pass Modal */}
      <DigitalDonorPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
