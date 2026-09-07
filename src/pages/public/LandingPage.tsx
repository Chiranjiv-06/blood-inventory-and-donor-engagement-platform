import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Droplets,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  Hospital,
  Users,
  Activity,
  Phone,
  Mail,
  HelpCircle,
  Siren,
  Clock,
  Sparkles,
  ChevronRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { QuickEmergencyModal } from '../../components/common/QuickEmergencyModal';

export const LandingPage: React.FC = () => {
  const { inventory, bloodBanks, emergencyAlerts, setRole } = useApp();
  const navigate = useNavigate();

  const [searchBloodGroup, setSearchBloodGroup] = useState('O+');
  const [searchLocation, setSearchLocation] = useState('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Stats calculation
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.quantityUnits, 0);
  const activeDonorsCount = 1420;
  const activeBloodBanksCount = bloodBanks.length + 18;
  const urgentCount = emergencyAlerts.filter((a) => a.status === 'Open').length + 5;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('donor');
    navigate('/donor/nearby');
  };

  const bloodCompatibilityData = [
    { group: 'O-', canGive: 'All (Universal Donor)', canReceive: 'O-' },
    { group: 'O+', canGive: 'O+, A+, B+, AB+', canReceive: 'O+, O-' },
    { group: 'A-', canGive: 'A-, A+, AB-, AB+', canReceive: 'A-, O-' },
    { group: 'A+', canGive: 'A+, AB+', canReceive: 'A+, A-, O+, O-' },
    { group: 'B-', canGive: 'B-, B+, AB-, AB+', canReceive: 'B-, O-' },
    { group: 'B+', canGive: 'B+, AB+', canReceive: 'B+, B-, O+, O-' },
    { group: 'AB-', canGive: 'AB-, AB+', canReceive: 'AB-, A-, B-, O-' },
    { group: 'AB+', canGive: 'AB+ only', canReceive: 'All (Universal Recipient)' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Emergency Ticker Banner */}
      <div className="bg-red-600 text-white text-xs py-2 px-4 flex items-center justify-between overflow-hidden shadow-inner">
        <div className="flex items-center gap-2 mx-auto max-w-7xl w-full justify-between">
          <div className="flex items-center gap-2 animate-pulse font-medium truncate">
            <Siren className="w-4 h-4 flex-shrink-0" />
            <span>
              URGENT APPEAL: Critical shortage of O- Negative & Platelet units in Metro Central.
            </span>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 font-bold underline hover:text-red-100 text-xs flex-shrink-0"
          >
            Broadcast Request &rarr;
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                BloodLink
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Healthcare Network
              </span>
            </div>
          </Link>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
              Features
            </a>
            <a href="#search-bank" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
              Availability
            </a>
            <a href="#how-it-works" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
              How It Works
            </a>
            <a href="#compatibility" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
              Compatibility
            </a>
            <a href="#benefits" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
              Benefits
            </a>
          </nav>

          {/* Auth & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              to="/admin-login"
              className="px-3 py-1.5 text-xs font-bold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center gap-1"
              title="Super Administrator Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>

            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-750"
            >
              User Login
            </Link>

            <Link
              to="/register"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-red-50/40 via-white to-white dark:from-red-950/20 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-blood-600 dark:text-blood-400" />
                <span>Next-Generation Healthcare Blood Grid</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Donate Blood.{' '}
                <span className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                  Save Lives.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                BloodLink is the centralized, real-time blood inventory and emergency dispatch platform connecting voluntary donors, hospital trauma teams, and certified blood centers in milliseconds.
              </p>

              {/* Fast Direct Role Entrances */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mb-10">
                <Link
                  to="/donor/book"
                  onClick={() => setRole('donor')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-lg shadow-red-600/30 transition-all hover:scale-102"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Book a Donation
                </Link>

                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-red-700 dark:text-red-300 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 shadow-sm transition-all"
                >
                  <Siren className="w-5 h-5 text-red-600" />
                  Request Emergency Blood
                </button>

                <Link
                  to="/donor"
                  onClick={() => setRole('donor')}
                  className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Explore Donor Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social Proof Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Verified Blood Centers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Sub-second Dispatch Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>24/7 Transfusion Response</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Search Card */}
            <div id="search-bank" className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative">
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  Live Stock Finder
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Check Blood Availability
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Locate verified units and certified blood banks within your immediate zone.
                </p>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Blood Group
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                        <button
                          type="button"
                          key={bg}
                          onClick={() => setSearchBloodGroup(bg)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            searchBloodGroup === bg
                              ? 'bg-blood-600 text-white border-blood-600 shadow-md shadow-red-500/20'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your City / District / ZIP
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="e.g. Metro Central, North Bay, 10001"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 shadow-md transition-all text-sm mt-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Real-Time Inventory
                  </button>
                </form>

                {/* Quick preview stats */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      24 Units of {searchBloodGroup} available in 5km radius
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Ribbon */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-red-500 mb-1">{totalUnits}+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available Blood Units
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-1">{activeDonorsCount}+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Registered Donors
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">{activeBloodBanksCount}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Certified Blood Banks
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mb-1">{urgentCount}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Urgent Requests
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blood-600 dark:text-blood-400">
              Seamless Tri-Party Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 mb-4">
              How BloodLink Powers Rapid Lifesaving
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A synchronized digital loop that moves blood from healthy donors to clinical vaults and urgent hospital trauma beds without delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-xl mb-6 border border-red-200 dark:border-red-900">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Donor Engagement
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Donors complete instant digital eligibility checks, book time slots at nearby certified hubs, or respond directly to local hospital emergency appeals.
              </p>
              <Link
                to="/donor/book"
                onClick={() => setRole('donor')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blood-600 dark:text-blood-400 hover:underline"
              >
                Book Donation &rarr;
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl mb-6 border border-blue-200 dark:border-blue-900">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" /> Blood Bank Vaults
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Centers harvest, separate into components (RBC, Platelets, FFP), test for pathogens, track cold storage temperature, and list verified stock online.
              </p>
              <Link
                to="/bloodbank"
                onClick={() => setRole('bloodbank')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Explore Blood Bank Hub &rarr;
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl mb-6 border border-purple-200 dark:border-purple-900">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Hospital className="w-5 h-5 text-purple-500" /> Hospital Transfusion
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Trauma surgeries & ICU wards broadcast urgent requisitions, match with nearest available units, track courier cold-chain ETA, and transfuse patients safely.
              </p>
              <Link
                to="/hospital"
                onClick={() => setRole('hospital')}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Open Hospital Desk &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Compatibility Guide */}
      <section id="compatibility" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blood-600 dark:text-blood-400">
              Medical Reference
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 mb-3">
              Blood Compatibility Matrix
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Understanding universal donors and recipients for whole blood and red blood cell compatibility.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 text-xs uppercase font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Blood Type</th>
                  <th className="py-3.5 px-6">Can Donate Red Blood Cells To</th>
                  <th className="py-3.5 px-6">Can Receive Red Blood Cells From</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {bloodCompatibilityData.map((item) => (
                  <tr key={item.group} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-xs border border-red-200 dark:border-red-900">
                        {item.group}
                      </span>
                      <span>Type {item.group}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 dark:text-slate-300 font-medium">
                      {item.canGive}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 dark:text-slate-300">
                      {item.canReceive}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to="/donor/book"
                        onClick={() => setRole('donor')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors inline-block"
                      >
                        Donate {item.group}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Engineered For Every Healthcare Stakeholder
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Purpose-built tools for voluntary lifesavers, hospital triage managers, and laboratory administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Donors */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">For Blood Donors</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Instant pre-screening eligibility quiz
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Digital certificate download & lives-saved counter
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Direct push notifications for critical matches
                </li>
              </ul>
            </div>

            {/* For Blood Banks */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">For Blood Banks</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Real-time stock matrix with near-expiry alerts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Donor queue & appointment scheduling calendar
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Hospital emergency order fulfillment portal
                </li>
              </ul>
            </div>

            {/* For Hospitals */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Hospital className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">For Hospitals & Trauma</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Single-click urgent requisition broadcast
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Live tracking timeline from match to transfusion
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Automated inter-bank inventory matching
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Call-To-Action Banner */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-rose-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Every 2 Seconds, Someone Needs Blood.
            </h2>
            <p className="text-red-100 text-sm max-w-xl leading-relaxed">
              Your single 450ml donation can save up to 3 trauma victims, cancer patients, or newborns. Register today and join the emergency lifeline network.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl font-bold text-red-600 bg-white hover:bg-red-50 shadow-lg transition-all"
            >
              Join as a Donor
            </Link>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-5 py-3.5 rounded-xl font-bold text-white bg-red-800/80 hover:bg-red-800 border border-white/20 transition-all flex items-center gap-2"
            >
              <Siren className="w-4 h-4" />
              Emergency Requisition
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-lg mb-3">
              <Droplets className="w-5 h-5 text-red-500" /> BloodLink
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Centralized real-time blood inventory and emergency donor engagement infrastructure.
            </p>
            <p className="text-slate-500 text-[11px]">
              Compliance Certified: HIPAA & ISO 15189 Medical Laboratory Standards.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/donor/book" onClick={() => setRole('donor')} className="hover:text-white transition-colors">
                  Book Donation
                </Link>
              </li>
              <li>
                <Link to="/donor/eligibility" onClick={() => setRole('donor')} className="hover:text-white transition-colors">
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link to="/donor/nearby" onClick={() => setRole('donor')} className="hover:text-white transition-colors">
                  Find Blood Bank
                </Link>
              </li>
              <li>
                <Link to="/bloodbank" onClick={() => setRole('bloodbank')} className="hover:text-white transition-colors">
                  Blood Bank Portal
                </Link>
              </li>
              <li>
                <Link to="/hospital" onClick={() => setRole('hospital')} className="hover:text-white transition-colors">
                  Hospital Trauma Desk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Support & Legal</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Help & FAQs</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Donor Rights & Safety</li>
              <li className="hover:text-white cursor-pointer">Audit & Compliance Reports</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Emergency Hotlines</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span>National Emergency: 1-800-BLOOD-LINK</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@bloodlink.health</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Central Health Grid HQ, Suite 400</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>© 2026 BloodLink Platform. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>

      {/* Quick Emergency Modal */}
      <QuickEmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};
