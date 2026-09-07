import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { QuickEmergencyModal } from '../../components/common/QuickEmergencyModal';
import { Siren, PlusCircle, Hospital, Clock, Phone, CheckCircle2, ShieldAlert, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const HospitalEmergencyRequests: React.FC = () => {
  const { emergencyAlerts, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-600 animate-pulse" /> Emergency Trauma Requisition Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Rapid broadcasts for massive hemorrhage protocols, catastrophic trauma, and pediatric surgeries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Hospital_Emergency_Broadcasts_${getTodayDateString()}`,
                emergencyAlerts,
                [
                  { header: 'Broadcast ID', accessor: 'id' },
                  { header: 'Blood Group', accessor: 'bloodGroup' },
                  { header: 'Component', accessor: 'component' },
                  { header: 'Units Required', accessor: 'unitsRequired' },
                  { header: 'Urgency', accessor: 'urgency' },
                  { header: 'Required By', accessor: 'requiredBy' },
                  { header: 'Reason / Clinical Context', accessor: 'reason' },
                  { header: 'Status', accessor: 'status' },
                ]
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all animate-pulse-subtle"
          >
            <Siren className="w-4 h-4" /> Trigger Emergency Broadcast
          </button>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="space-y-4">
        {emergencyAlerts.map((alert) => (
          <Card key={alert.id} className="p-6 border-l-4 border-l-red-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm" dot>
                    {alert.urgency} Code Red
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">#{alert.id}</span>
                  <span className="text-xs text-slate-500">Target: {alert.requiredBy}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                  {alert.unitsRequired} Units of {alert.bloodGroup} ({alert.component})
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {alert.reason}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  {alert.status === 'Open' ? 'Active Broadcast • 14 Donors Alerted' : `Status: ${alert.status}`}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <QuickEmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
