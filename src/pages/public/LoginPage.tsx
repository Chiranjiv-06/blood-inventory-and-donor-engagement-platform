import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Droplets, Heart, Building2, Hospital, ArrowRight, Lock, Mail, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const LoginPage: React.FC = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrPhone, setEmailOrPhone] = useState('alex.mitchell@gmail.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'bloodbank' | 'hospital'>('donor');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginUser(emailOrPhone, password, 'user');
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid user credentials.');
      return;
    }

    const user = res.user!;
    if (user.accountStatus === 'pending') {
      navigate('/account-pending', { replace: true });
    } else if (user.accountStatus === 'suspended' || user.accountStatus === 'rejected') {
      navigate('/account-status', { replace: true });
    } else {
      const from = (location.state as any)?.from?.pathname || `/${user.role}`;
      navigate(from, { replace: true });
    }
  };

  const handleQuickPersona = (role: 'donor' | 'bloodbank' | 'hospital') => {
    setSelectedRole(role);
    setErrorMessage('');
    let email = 'alex.mitchell@gmail.com';
    if (role === 'bloodbank') email = 'operations@redcross-metro.org';
    else if (role === 'hospital') email = 'emergency-transfusion@stjude-hospital.org';

    setEmailOrPhone(email);
    setPassword('password123');

    const res = loginUser(email, 'password123', 'user');
    if (res.success && res.user) {
      if (res.user.accountStatus === 'pending') {
        navigate('/account-pending');
      } else if (res.user.accountStatus === 'suspended' || res.user.accountStatus === 'rejected') {
        navigate('/account-status');
      } else {
        navigate(`/${role}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <Link
          to="/admin-login"
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-850 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Admin Login Portal
        </Link>
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            <Droplets className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
            BloodLink
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          User Login
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Sign in for Donors, Blood Banks, and Hospitals.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10">
          {/* Persona 1-Click Fast Logins */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick User Demo Personas:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('donor')}
                className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-left hover:bg-red-100 transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-red-900 dark:text-red-200">
                  <Heart className="w-3.5 h-3.5 text-red-600" /> Donor
                </div>
                <div className="text-[10px] text-red-600 dark:text-red-400 truncate">Alex (O+)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('bloodbank')}
                className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-left hover:bg-blue-100 transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Blood Bank
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 truncate">Metro Hub</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('hospital')}
                className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-left hover:bg-purple-100 transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-purple-900 dark:text-purple-200">
                  <Hospital className="w-3.5 h-3.5 text-purple-600" /> Hospital
                </div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 truncate">St. Jude</div>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-semibold">
                Or sign in with email / phone
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {errorMessage}
                {errorMessage.includes('Admin') && (
                  <Link to="/admin-login" className="block mt-1 font-bold underline text-red-800 dark:text-red-200">
                    Go to Admin Login &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Role Type
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              >
                <option value="donor">Donor</option>
                <option value="bloodbank">Blood Bank / Transfusion Center</option>
                <option value="hospital">Hospital / Trauma Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address or Phone
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blood-600 focus:ring-blood-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-blood-600 dark:text-blood-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all text-sm mt-2"
            >
              Sign In to User Portal <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div>
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-bold text-blood-600 dark:text-blood-400 hover:underline">
                Create an account
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link to="/admin-login" className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Portal Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
