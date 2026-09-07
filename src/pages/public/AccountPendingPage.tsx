import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Droplets, Clock, ShieldCheck, LogOut, ArrowLeft, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const AccountPendingPage: React.FC = () => {
  const { currentUser, updateUserAccountStatus, logout, addToast } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCheckStatus = () => {
    if (currentUser?.accountStatus === 'active') {
      addToast({
        type: 'success',
        title: 'Account Approved!',
        message: 'Your account is now active. Directing to dashboard...',
      });
      navigate(`/${currentUser.role}`);
    } else {
      addToast({
        type: 'info',
        title: 'Pending Review',
        message: 'Your application is still under review by a regional administrator.',
      });
    }
  };

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
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-900 shadow-inner animate-pulse-subtle">
            <Clock className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
            Approval Pending
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            Waiting for Administrator Approval
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Thank you for registering with BloodLink. To ensure the safety of the clinical blood transfusion network, new accounts are verified by a regional administrator before dashboard access is granted.
          </p>

          {currentUser && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Email:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Role:</span>
                <span className="font-bold text-blood-600 dark:text-blood-400 uppercase tracking-wider">{currentUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted On:</span>
                <span className="text-slate-600 dark:text-slate-400">{currentUser.registeredAt || 'Today'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Pending Review</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                if (currentUser) {
                  // Direct instant approval trigger
                  updateUserAccountStatus(currentUser.id, 'active', 'Verified');
                  addToast({
                    type: 'success',
                    title: 'Account Instantly Approved!',
                    message: `Welcome, ${currentUser.name}! You now have full access to your ${currentUser.role} dashboard.`,
                  });
                  navigate(`/${currentUser.role}`);
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> ⚡ Instant Admin Approval (Demo)
            </button>

            <button
              onClick={handleCheckStatus}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Check Status
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span>Are you a Super Administrator? </span>
            <Link to="/admin-login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Log in to Admin Console &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
