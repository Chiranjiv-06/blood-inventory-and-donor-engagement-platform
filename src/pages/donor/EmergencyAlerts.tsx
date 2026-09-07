import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyAlert } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  AlertOctagon,
  Siren,
  Hospital,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  Share2,
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const EmergencyAlerts: React.FC = () => {
  const { emergencyAlerts, respondToEmergencyAlert, currentUser } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);

  const getUrgencyBadge = (urgency: EmergencyAlert['urgency']) => {
    switch (urgency) {
      case 'Critical':
        return <Badge variant="danger" size="md" dot>Critical Urgency</Badge>;
      case 'Urgent':
        return <Badge variant="amber" size="md" dot>Urgent Priority</Badge>;
      case 'Normal':
      default:
        return <Badge variant="medical" size="md">Scheduled Need</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-600 animate-pulse" /> Emergency Blood Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time appeals from trauma centers and ICUs with critical blood unit shortages.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Emergency_Alerts_${getTodayDateString()}`,
              emergencyAlerts,
              [
                { header: 'Alert ID', accessor: 'id' },
                { header: 'Hospital Name', accessor: 'hospitalName' },
                { header: 'Hospital Address', accessor: 'hospitalAddress' },
                { header: 'Blood Group Needed', accessor: 'bloodGroup' },
                { header: 'Component', accessor: 'component' },
                { header: 'Units Required', accessor: 'unitsRequired' },
                { header: 'Urgency Level', accessor: 'urgency' },
                { header: 'Required By', accessor: 'requiredBy' },
                { header: 'Contact Person', accessor: 'contactPerson' },
                { header: 'Contact Phone', accessor: 'contactPhone' },
                { header: 'Status', accessor: 'status' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      {/* Grid of Emergency Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {emergencyAlerts.map((alert) => {
          const isCritical = alert.urgency === 'Critical';
          const isAccepted = alert.status === 'Accepted';
          const isDeclined = alert.status === 'Declined';

          return (
            <Card
              key={alert.id}
              className={`p-6 border-2 transition-all relative overflow-hidden ${
                isCritical
                  ? 'border-red-500/70 dark:border-red-800/80 bg-gradient-to-br from-red-50/40 via-white to-white dark:from-red-950/20 dark:via-slate-900 dark:to-slate-900 shadow-lg shadow-red-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Top Urgency and Blood Group header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/30 flex-shrink-0">
                    {alert.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {getUrgencyBadge(alert.urgency)}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {alert.createdAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Needs {alert.unitsRequired} Units ({alert.component})
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{alert.requiredBy}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {alert.distanceKm} km away
                  </span>
                </div>
              </div>

              {/* Hospital & Reason Info */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-750 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Hospital className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{alert.hospitalName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alert.hospitalAddress}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium pt-1 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                  Reason: "{alert.reason}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blood-600 hover:underline"
                >
                  View Case Details &rarr;
                </button>

                <div className="flex items-center gap-2">
                  {alert.status === 'Open' ? (
                    <>
                      <button
                        onClick={() => respondToEmergencyAlert(alert.id, 'Declined')}
                        className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cannot Donate
                      </button>
                      <button
                        onClick={() => respondToEmergencyAlert(alert.id, 'Accepted')}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> I Can Donate
                      </button>
                    </>
                  ) : isAccepted ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" /> Accepted — Fast Track Ready
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      Response Recorded: Declined
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Detail Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`Urgent Transfusion Case #${selectedAlert.id}`}
          subtitle={`${selectedAlert.hospitalName} • Priority Dispatch`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-700 dark:text-red-300">
                  Target Compatibility Match:
                </span>
                <div className="text-lg font-black text-red-900 dark:text-red-100">
                  {selectedAlert.unitsRequired} Units of {selectedAlert.bloodGroup} ({selectedAlert.component})
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-red-600 dark:text-red-400 font-bold block">
                  Deadline:
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedAlert.requiredBy}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Facility Contact & Triage Desk</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Contact: <strong>{selectedAlert.contactPerson}</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blood-600" />
                Hotline: <strong>{selectedAlert.contactPhone}</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blood-600" />
                Address: <strong>{selectedAlert.hospitalAddress}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
              {selectedAlert.status === 'Open' && (
                <button
                  onClick={() => {
                    respondToEmergencyAlert(selectedAlert.id, 'Accepted');
                    setSelectedAlert(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md"
                >
                  Accept & Get Passage Token
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
