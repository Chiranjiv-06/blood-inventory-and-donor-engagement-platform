import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalBloodRequest } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Siren,
  Hospital,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Package,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const BloodBankEmergencyRequests: React.FC = () => {
  const { hospitalRequests, allocateHospitalRequest, fulfillHospitalRequest, currentUser, addToast } = useApp();
  const [selectedReq, setSelectedReq] = useState<HospitalBloodRequest | null>(null);
  const [allocatedUnits, setAllocatedUnits] = useState<number>(3);

  const incomingRequests = hospitalRequests.filter(
    (r) => r.status !== 'Fulfilled' && r.status !== 'Cancelled'
  );

  const handleAllocate = (req: HospitalBloodRequest, units: number) => {
    allocateHospitalRequest(req.id, currentUser.id, currentUser.name);
    addToast({
      type: 'success',
      title: 'Blood Units Allocated & Courier Dispatched',
      message: `${units} units of ${req.bloodGroup} allocated to ${req.hospitalName}. Tracking token active.`,
    });
    setSelectedReq(null);
  };

  const handleDecline = (req: HospitalBloodRequest) => {
    addToast({
      type: 'info',
      title: 'Request Routed to Alternate Hub',
      message: `${req.hospitalName}'s requisition was released to other regional blood centers.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-600 animate-pulse" />
            Incoming Hospital Emergency Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Trauma unit requisitions requiring immediate cold-chain verification and blood unit allocation.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Facility_Emergency_Requests_${getTodayDateString()}`,
              incomingRequests,
              [
                { header: 'Request ID', accessor: (r) => r.requestId || r.id },
                { header: 'Hospital Name', accessor: 'hospitalName' },
                { header: 'Location', accessor: 'hospitalLocation' },
                { header: 'Patient Ref ID', accessor: 'patientRefId' },
                { header: 'Blood Group', accessor: 'bloodGroup' },
                { header: 'Component', accessor: 'component' },
                { header: 'Quantity (Units)', accessor: 'quantityUnits' },
                { header: 'Urgency Level', accessor: 'urgency' },
                { header: 'Required By', accessor: 'requiredBy' },
                { header: 'Status', accessor: 'status' },
                { header: 'Created Date/Time', accessor: 'createdAt' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {incomingRequests.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-sm">
            No pending hospital requisitions at this moment.
          </Card>
        ) : (
          incomingRequests.map((req) => (
            <Card
              key={req.id}
              className={`p-6 border-2 transition-all ${
                req.urgency === 'Critical'
                  ? 'border-red-500/70 bg-gradient-to-r from-red-50/30 to-white dark:from-red-950/20 dark:to-slate-900 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/25 flex-shrink-0">
                    {req.bloodGroup}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {req.requestId}
                      </span>
                      {req.urgency === 'Critical' ? (
                        <Badge variant="danger" size="sm" dot>
                          Critical Level-1
                        </Badge>
                      ) : req.urgency === 'Urgent' ? (
                        <Badge variant="amber" size="sm" dot>
                          Urgent Priority
                        </Badge>
                      ) : (
                        <Badge variant="medical" size="sm">
                          Normal Request
                        </Badge>
                      )}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Patient Ref: {req.patientRefId}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-purple-600" />
                      {req.hospitalName} &bull; Needs {req.quantityUnits} Units ({req.component})
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Required By: <strong>{req.requiredBy}</strong> &bull; Note: "{req.notes}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleDecline(req)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Decline / Route Out
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReq(req);
                      setAllocatedUnits(Math.min(2, req.quantityUnits));
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition-colors"
                  >
                    Partial Fulfill
                  </button>

                  <button
                    onClick={() => handleAllocate(req, req.quantityUnits)}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/25 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept & Full Allocate ({req.quantityUnits} Units)
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Partial / Custom Allocation Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Allocate Units for Requisition ${selectedReq.requestId}`}
          subtitle={`${selectedReq.hospitalName} • Requested ${selectedReq.quantityUnits} Units of ${selectedReq.bloodGroup}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Units to Allocate from Cold Vault:
              </label>
              <input
                type="number"
                min="1"
                max={selectedReq.quantityUnits}
                value={allocatedUnits}
                onChange={(e) => setAllocatedUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">
                Max available: {selectedReq.quantityUnits} units
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
              Allocating will mark blood units as <strong>Reserved</strong> in vault and generate MediExpress ColdLink logistics dispatch.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAllocate(selectedReq, allocatedUnits)}
                className="px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md"
              >
                Dispatch {allocatedUnits} Units
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
