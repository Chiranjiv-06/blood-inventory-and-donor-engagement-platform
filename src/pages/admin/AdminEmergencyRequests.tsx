import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Siren, Hospital, Clock, MapPin, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminEmergencyRequests: React.FC = () => {
  const { emergencyAlerts } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-600 animate-pulse" /> National Emergency Dispatch Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Supervise high-priority trauma requisitions, response times, and inter-city donor mobilizations.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Admin_Emergency_Requests_${getTodayDateString()}`,
              emergencyAlerts,
              [
                { header: 'Alert ID', accessor: 'id' },
                { header: 'Hospital Name', accessor: 'hospitalName' },
                { header: 'Blood Group', accessor: 'bloodGroup' },
                { header: 'Component', accessor: 'component' },
                { header: 'Units Required', accessor: 'unitsRequired' },
                { header: 'Urgency Level', accessor: 'urgency' },
                { header: 'Required By', accessor: 'requiredBy' },
                { header: 'Reason / Case Notes', accessor: 'reason' },
                { header: 'Dispatched Date/Time', accessor: 'createdAt' },
                { header: 'Status', accessor: 'status' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      <div className="space-y-4">
        {emergencyAlerts.map((alert) => (
          <Card key={alert.id} className="p-6 border-l-4 border-l-red-600">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm" dot>
                    {alert.urgency}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    ID: {alert.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    Dispatched: {alert.createdAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-purple-600" />
                  {alert.hospitalName} &bull; Required: {alert.unitsRequired} Units of {alert.bloodGroup} ({alert.component})
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Reason: "{alert.reason}" &bull; Deadline: <strong>{alert.requiredBy}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  Broadcast Status: {alert.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
