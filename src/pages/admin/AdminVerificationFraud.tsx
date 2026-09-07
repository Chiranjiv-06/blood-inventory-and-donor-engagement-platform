import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FraudAlertItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Lock,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminVerificationFraud: React.FC = () => {
  const { fraudAlerts, updateFraudStatus, addToast } = useApp();
  const [selectedFraud, setSelectedFraud] = useState<FraudAlertItem | null>(null);

  const handleAction = (id: string, newStatus: FraudAlertItem['status']) => {
    updateFraudStatus(id, newStatus);
    setSelectedFraud(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" /> Security Surveillance & Fraud Flags
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automated heuristic triggers detecting duplicate national identities, abnormal emergency spikes, and credential discrepancies.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Admin_Fraud_Flags_${getTodayDateString()}`,
              fraudAlerts,
              [
                { header: 'Case ID', accessor: 'id' },
                { header: 'Trigger Type', accessor: 'type' },
                { header: 'Flagged Entity', accessor: 'entityName' },
                { header: 'Role', accessor: 'role' },
                { header: 'Severity Risk', accessor: 'severity' },
                { header: 'Incident Description', accessor: 'description' },
                { header: 'Detected At', accessor: 'detectedAt' },
                { header: 'Status', accessor: 'status' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      {/* Fraud Flag Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fraudAlerts.map((flag) => {
          const isCritical = flag.severity === 'Critical' || flag.severity === 'High';

          return (
            <Card
              key={flag.id}
              className={`p-6 border-2 transition-all ${
                isCritical
                  ? 'border-rose-500/70 bg-rose-50/20 dark:bg-rose-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {flag.type}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Case ID: {flag.id}</p>
                  </div>
                </div>

                <Badge variant={isCritical ? 'danger' : 'warning'} size="sm" dot>
                  {flag.severity} Risk
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 my-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flagged Entity:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {flag.entityName} ({flag.role.toUpperCase()})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected At:</span>
                  <span className="text-slate-600 dark:text-slate-400">{flag.detectedAt}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {flag.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-500">
                  Status: <strong>{flag.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFraud(flag)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Investigate
                  </button>
                  {flag.status !== 'Resolved' && (
                    <button
                      onClick={() => handleAction(flag.id, 'Resolved')}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      Clear Flag
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Investigation Details Modal */}
      {selectedFraud && (
        <Modal
          isOpen={!!selectedFraud}
          onClose={() => setSelectedFraud(null)}
          title={`Security Investigation: ${selectedFraud.type}`}
          subtitle={`Entity: ${selectedFraud.entityName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedFraud.description}
              </p>
              <div className="text-[11px] text-slate-400">
                Logged by Automated Regulatory Rule Engine v2.4
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedFraud(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleAction(selectedFraud.id, 'Banned')}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Restrict & Ban Entity
              </button>
              <button
                onClick={() => handleAction(selectedFraud.id, 'Resolved')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                Approve & Resolve Case
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
