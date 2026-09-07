import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Bell,
  CheckCheck,
  AlertCircle,
  Calendar,
  Package,
  Shield,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';
import { Link } from 'react-router-dom';

export const DonorNotifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-amber-500" />;
      default:
        return <Shield className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Notifications & System Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Emergency match dispatches, appointment reminders, and test results.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Notifications_${getTodayDateString()}`,
                filteredNotifications,
                [
                  { header: 'Notification ID', accessor: 'id' },
                  { header: 'Title', accessor: 'title' },
                  { header: 'Category', accessor: 'type' },
                  { header: 'Message', accessor: 'message' },
                  { header: 'Date/Time', accessor: 'timestamp' },
                  { header: 'Read Status', accessor: (n) => (n.read ? 'Read' : 'Unread') },
                ]
              );
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-semibold">
        {['all', 'emergency', 'appointment', 'system'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`pb-2.5 capitalize border-b-2 transition-all ${
              filterType === t
                ? 'border-blood-600 text-blood-600 dark:text-blood-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t} Alerts
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-sm">
            No notifications under this filter category.
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 transition-all cursor-pointer ${
                !notif.read
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20'
                  : 'bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {notif.title}
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.actionUrl && (
                    <Link
                      to={notif.actionUrl}
                      className="inline-block mt-2 text-xs font-semibold text-blood-600 dark:text-blood-400 hover:underline"
                    >
                      View related details &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
