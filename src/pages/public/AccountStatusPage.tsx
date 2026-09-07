import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Droplets, ShieldAlert, LogOut, ArrowLeft, Mail } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AccountStatusPage: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isSuspended = currentUser?.accountStatus === 'suspended';
  const isRejected = currentUser?.accountStatus === 'rejected';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            <Droplets className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
            BloodLink
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 border border-rose-200 dark:border-rose-900 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
            {isSuspended ? 'Account Suspended' : isRejected ? 'Application Rejected' : 'Access Restricted'}
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {isSuspended ? 'Your Account Has Been Suspended' : 'Account Access Not Approved'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {isSuspended
              ? 'This account has been temporarily deactivated due to regulatory compliance review or administrative flags. Dashboard operations are locked.'
              : 'Your application was not approved by the regional healthcare board. Please reach out to support for documentation appeals.'}
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Account Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Registered User'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 capitalize">{currentUser?.accountStatus}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:compliance@bloodlink.gov"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-xs transition-all"
            >
              <Mail className="w-3.5 h-3.5" /> Contact Compliance Office
            </a>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
