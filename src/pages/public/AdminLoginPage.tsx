import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Droplets, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AdminLoginPage: React.FC = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin.supervision@bloodlink.gov');
  const [password, setPassword] = useState('adminpassword123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginUser(email, password, 'admin');
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid administrator credentials.');
      return;
    }

    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from, { replace: true });
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin.supervision@bloodlink.gov');
    setPassword('adminpassword123');
    const res = loginUser('admin.supervision@bloodlink.gov', 'adminpassword123', 'admin');
    if (res.success) {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            BloodLink Admin
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Super Administrator Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Authorized regulatory & supervisory access only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-850 py-8 px-6 shadow-2xl border border-slate-750 rounded-3xl sm:px-10">
          {/* Quick Demo 1-Click Button */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Admin Demo Login:
            </label>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full p-3 rounded-xl border border-emerald-800/80 bg-emerald-950/40 text-left hover:bg-emerald-900/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  EV
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Dr. Evelyn Vance</div>
                  <div className="text-[10px] text-slate-400">Chief Regulatory Supervisor</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md">
                Enter &rarr;
              </span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-850 px-2 text-slate-400 font-semibold">
                Or sign in with Admin ID
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Government Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all text-sm mt-4"
            >
              Authenticate & Open Console <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-750 flex items-center justify-between text-xs text-slate-400">
            <Link to="/login" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> User Login
            </Link>

            <Link to="/" className="hover:text-white transition-colors">
              Return to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
