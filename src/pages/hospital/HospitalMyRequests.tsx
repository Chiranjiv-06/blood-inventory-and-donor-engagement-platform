import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HospitalBloodRequest } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Clock,
  PlusCircle,
  Building2,
  CheckCircle2,
  XCircle,
  Navigation,
  Phone,
  AlertTriangle,
  Siren,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const HospitalMyRequests: React.FC = () => {
  const { hospitalRequests, cancelHospitalRequest, allocateHospitalRequest, fulfillHospitalRequest, addToast } = useApp();
  const [selectedReq, setSelectedReq] = useState<HospitalBloodRequest | null>(null);

  const getStatusBadge = (status: HospitalBloodRequest['status']) => {
    switch (status) {
      case 'Fulfilled':
        return <Badge variant="success" size="sm" dot>Fulfilled</Badge>;
      case 'Allocated':
      case 'Accepted':
      case 'In Transit':
        return <Badge variant="purple" size="sm" dot>{status}</Badge>;
      case 'Matched':
        return <Badge variant="medical" size="sm" dot>Matched</Badge>;
      case 'Cancelled':
        return <Badge variant="danger" size="sm">Cancelled</Badge>;
      case 'Pending':
      default:
        return <Badge variant="warning" size="sm" dot>Pending Matching</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Hospital Blood Requisitions & Status Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time status timeline and matched blood bank allocation records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Hospital_Requisitions_${getTodayDateString()}`,
                hospitalRequests,
                [
                  { header: 'Request ID', accessor: (r) => r.requestId || r.id },
                  { header: 'Patient Ref ID', accessor: 'patientRefId' },
                  { header: 'Blood Group', accessor: 'bloodGroup' },
                  { header: 'Component', accessor: 'component' },
                  { header: 'Units Required', accessor: 'quantityUnits' },
                  { header: 'Urgency Level', accessor: 'urgency' },
                  { header: 'Required By', accessor: 'requiredBy' },
                  { header: 'Allocated Facility', accessor: (r) => r.allocatedBloodBankName || 'Pending Allocation' },
                  { header: 'Status', accessor: 'status' },
                  { header: 'Created Date/Time', accessor: 'createdAt' },
                ]
              );
              addToast({
                type: 'success',
                title: 'CSV Exported',
                message: `Exported ${hospitalRequests.length} requisition records.`,
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <Link
            to="/hospital/create-request"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Requisition
          </Link>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {hospitalRequests.map((req) => {
          const isCritical = req.urgency === 'Critical';

          return (
            <Card
              key={req.id}
              className={`p-6 border-2 transition-all ${
                isCritical && req.status !== 'Fulfilled'
                  ? 'border-red-500/80 bg-red-50/15 dark:bg-red-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                    {req.requestId}
                  </span>
                  <Badge
                    variant={
                      req.urgency === 'Critical'
                        ? 'danger'
                        : req.urgency === 'Urgent'
                        ? 'amber'
                        : 'medical'
                    }
                    size="sm"
                    dot
                  >
                    {req.urgency}
                  </Badge>
                  {getStatusBadge(req.status)}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Created: {req.createdAt}</span>
                  <span>&bull;</span>
                  <span>Required: <strong>{req.requiredBy}</strong></span>
                </div>
              </div>

              {/* Middle Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-750">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Target Requirement
                  </span>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {req.quantityUnits} Units of {req.bloodGroup} ({req.component})
                  </div>
                  <span className="text-slate-500">Patient Ref: {req.patientRefId}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-750">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Allocated Blood Facility
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {req.allocatedBloodBankName || (req.matchedBloodBanks && req.matchedBloodBanks[0]?.bloodBankName) || 'Matching in progress...'}
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {req.status === 'Fulfilled' ? 'Transfusion Completed' : 'Cold Chain Certified'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-750 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Clinical Indication
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic truncate mt-0.5">
                      "{req.notes || 'Routine surgical backup'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline Progression */}
              <div className="py-2">
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {['Pending', 'Matched', 'Accepted', 'Allocated', 'Fulfilled'].map((step, idx) => {
                    const stepOrder = ['Pending', 'Matched', 'Accepted', 'Allocated', 'Fulfilled'];
                    const currentIdx = stepOrder.indexOf(req.status);
                    const isPassed = currentIdx >= idx;

                    return (
                      <div key={step} className="space-y-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPassed
                              ? 'bg-emerald-500'
                              : req.status === 'Cancelled'
                              ? 'bg-slate-300 dark:bg-slate-700'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                        <span
                          className={
                            isPassed
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matched Blood Banks Box (if matched) */}
              {req.matchedBloodBanks && req.matchedBloodBanks.length > 0 && req.status !== 'Fulfilled' && (
                <div className="mt-3 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 block mb-2">
                    Available Matches In Regional Blood Grid:
                  </span>
                  <div className="space-y-2">
                    {req.matchedBloodBanks.map((match) => (
                      <div
                        key={match.bloodBankId}
                        className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {match.bloodBankName}
                          </span>
                          <span className="text-slate-400 ml-2">
                            ({match.distanceKm} km &bull; ETA ~{match.estimatedArrivalMinutes} mins)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {match.availableUnits} Units Available
                          </span>
                          {req.status !== 'Allocated' && (
                            <button
                              onClick={() =>
                                allocateHospitalRequest(req.id, match.bloodBankId, match.bloodBankName)
                              }
                              className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                              Reserve Units
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {req.status === 'Allocated' && (
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Courier In Transit — Cold storage locked at 3.5°C
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'Allocated' && (
                    <button
                      onClick={() => fulfillHospitalRequest(req.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                    >
                      Confirm Transfusion Complete
                    </button>
                  )}

                  {req.status !== 'Fulfilled' && req.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelHospitalRequest(req.id)}
                      className="px-3.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    >
                      Cancel Requisition
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
