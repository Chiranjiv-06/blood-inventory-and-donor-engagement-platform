import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Building2,
  Phone,
  Mail,
  Clock,
  CalendarPlus,
  Star,
  CheckCircle2,
  Navigation,
  Droplets,
} from 'lucide-react';

export const NearbyBloodBanks: React.FC = () => {
  const { bloodBanks, currentUser } = useApp();

  const [searchCity, setSearchCity] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'All'>('All');
  const [activeBankId, setActiveBankId] = useState<string>(bloodBanks[0]?.id || 'bb_1');

  const filteredBanks = bloodBanks.filter((bank) => {
    if (searchCity && !bank.name.toLowerCase().includes(searchCity.toLowerCase()) && !bank.city.toLowerCase().includes(searchCity.toLowerCase())) {
      return false;
    }
    if (bank.distanceKm > maxDistance) {
      return false;
    }
    if (selectedGroup !== 'All' && (!bank.availableStock[selectedGroup] || bank.availableStock[selectedGroup] <= 0)) {
      return false;
    }
    return true;
  });

  const activeBank = bloodBanks.find((b) => b.id === activeBankId) || bloodBanks[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Nearby Certified Blood Banks & Centers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Find accredited collection hubs, monitor real-time stock levels, and book collection appointments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by center name, city, or district..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          {/* Blood Group Filter */}
          <div className="sm:col-span-1 lg:col-span-3">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            >
              <option value="All">All Blood Types</option>
              {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                <option key={bg} value={bg}>
                  Require {bg} Stock
                </option>
              ))}
            </select>
          </div>

          {/* Max Distance Slider */}
          <div className="sm:col-span-3 lg:col-span-4 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Radius: {maxDistance} km
            </span>
            <input
              type="range"
              min="2"
              max="30"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-blood-600 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Main Dual Layout: Interactive Map View & Facilities List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden border border-slate-800 h-96 flex flex-col justify-between shadow-xl">
            {/* Map Grid Canvas Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

            {/* Top map info */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live GPS Radar
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Lat: {activeBank.coordinates.lat.toFixed(4)}, Lng: {activeBank.coordinates.lng.toFixed(4)}
              </span>
            </div>

            {/* Simulated Interactive Map Pins */}
            <div className="relative z-10 my-auto grid grid-cols-3 gap-6 text-center">
              {bloodBanks.map((bank, index) => {
                const isActive = bank.id === activeBankId;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setActiveBankId(bank.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isActive
                        ? 'bg-red-600 text-white ring-4 ring-red-500/30 scale-105 shadow-xl'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <MapPin className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-[10px] font-bold truncate">{bank.name.split(' ')[0]}</div>
                    <div className="text-[9px] opacity-80">{bank.distanceKm} km</div>
                  </div>
                );
              })}
            </div>

            {/* Selected Bank Mini Card on bottom of map */}
            <div className="relative z-10 bg-slate-800/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                  {activeBank.name}
                </h4>
                <p className="text-[10px] text-slate-400">{activeBank.address}</p>
              </div>
              <Link
                to="/donor/book"
                className="px-3 py-1.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-[11px] font-bold text-white shadow-sm"
              >
                Book Here
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Blood Bank Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Showing {filteredBanks.length} certified facilities</span>
          </div>

          <div className="space-y-4">
            {filteredBanks.map((bank) => {
              const isSelected = bank.id === activeBankId;

              return (
                <Card
                  key={bank.id}
                  onClick={() => setActiveBankId(bank.id)}
                  className={`p-5 cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-blood-600 bg-red-50/30 dark:bg-red-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {bank.name}
                        </h3>
                        {bank.verified && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {bank.address}, {bank.city} &bull;{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {bank.distanceKm} km away
                        </span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bank.rating}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{bank.type}</span>
                    </div>
                  </div>

                  {/* Operational info */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {bank.openingHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {bank.phone}
                    </span>
                  </div>

                  {/* Stock Availability Matrix */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Real-Time Blood Stock Units:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center text-xs">
                      {Object.entries(bank.availableStock).map(([group, qty]) => (
                        <div
                          key={group}
                          className={`p-1.5 rounded-lg border ${
                            qty < 5
                              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="font-black text-[10px]">{group}</div>
                          <div className="font-semibold text-xs">{qty}u</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card footer CTA */}
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Link
                      to="/donor/book"
                      className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-blood-600 hover:bg-blood-700 shadow-sm transition-all"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
