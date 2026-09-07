import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Bell, Lock, Shield, Moon, Sun, Smartphone, Save, Globe } from 'lucide-react';

export const DonorSettings: React.FC = () => {
  const { isDarkMode, toggleTheme, addToast } = useApp();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalEmergencyPush, setCriticalEmergencyPush] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [anonymousDonations, setAnonymousDonations] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your notification and privacy preferences have been updated.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure emergency notification channels, data privacy, and application appearance.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance Setting */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Visual Theme & Appearance
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Dark Mode Palette
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Switch between clinical light mode and eye-friendly dark mode.
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blood-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Emergency Alert Preferences */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blood-600" />
            Emergency Dispatch & Notification Channels
          </h3>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Critical Level-1 Hospital Broadcasts
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Instant push notification when an immediate trauma patient needs your specific blood group.
                </div>
              </div>
              <input
                type="checkbox"
                checked={criticalEmergencyPush}
                onChange={(e) => setCriticalEmergencyPush(e.target.checked)}
                className="w-5 h-5 text-blood-600 rounded focus:ring-blood-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  SMS Text Notifications
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Receive appointment reminders and emergency tokens via text message.
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 text-blood-600 rounded focus:ring-blood-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Email Summaries & Certificates
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Receive donation completion reports, badges, and blood inventory updates.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 text-blood-600 rounded focus:ring-blood-500"
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Location */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Location & Data Privacy
          </h3>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Proximity Radius Matching
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Allow BloodLink to match nearby hospitals and blood hubs within your zone.
                </div>
              </div>
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="w-5 h-5 text-blood-600 rounded focus:ring-blood-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Anonymous Donor Recognition
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Hide your full name on public blood drive honor rolls.
                </div>
              </div>
              <input
                type="checkbox"
                checked={anonymousDonations}
                onChange={(e) => setAnonymousDonations(e.target.checked)}
                className="w-5 h-5 text-blood-600 rounded focus:ring-blood-500"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
