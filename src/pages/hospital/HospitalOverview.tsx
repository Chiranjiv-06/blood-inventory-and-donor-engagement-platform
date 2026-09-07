import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Hospital,
  Siren,
  Clock,
  CheckCircle2,
  PlusCircle,
  Building2,
  Activity,
  ArrowRight,
  Package,
} from 'lucide-react';

export const HospitalOverview: React.FC = () => {
  const { hospitalRequests, currentUser } = useApp();

  const activeRequests = hospitalRequests.filter((r) => r.status !== 'Fulfilled' && r.status !== 'Cancelled');
  const criticalRequests = hospitalRequests.filter((r) => r.urgency === 'Critical' && r.status !== 'Fulfilled');
  const matchedRequests = hospitalRequests.filter((r) => r.status === 'Matched' || r.status === 'Allocated');
  const fulfilledRequests = hospitalRequests.filter((r) => r.status === 'Fulfilled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentUser.name}
            </h1>
            <Badge variant="purple" size="sm" dot>
              Trauma Level-1 Center
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time surgical blood requisitions, automated cross-match routing, and transit tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/hospital/create-request"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create Blood Request
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Requisitions
            </span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeRequests.length} Orders
            </h4>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              Under live routing
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-red-200/80 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10">
          <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Critical Urgency
            </span>
            <h4 className="text-2xl font-black text-red-600 dark:text-red-400">
              {criticalRequests.length} Patients
            </h4>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
              Emergency priority
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Matched / In Transit
            </span>
            <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {matchedRequests.length} Matched
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Cold link en route
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fulfilled Transfusions
            </span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {fulfilledRequests.length} Orders
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              100% Success rate
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Request Timeline */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blood-600" />
              Recent Requisitions & Live Transfusion Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time progression from automated stock matching to patient transfusion.
            </p>
          </div>

          <Link
            to="/hospital/requests"
            className="text-xs font-semibold text-blood-600 dark:text-blood-400 hover:underline flex items-center gap-1"
          >
            All Requisitions ({hospitalRequests.length}) &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {hospitalRequests.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400">
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
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {req.quantityUnits} Units of {req.bloodGroup} ({req.component})
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Required By: <strong>{req.requiredBy}</strong>
                </div>
              </div>

              {/* Status Timeline Progression Bar */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold">
                  {['Pending', 'Matched', 'Accepted', 'Allocated', 'Fulfilled'].map((step, idx) => {
                    const stepOrder = ['Pending', 'Matched', 'Accepted', 'Allocated', 'Fulfilled'];
                    const currentIdx = stepOrder.indexOf(req.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = req.status === step;

                    return (
                      <div key={step} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isPassed
                              ? 'bg-emerald-500'
                              : isCurrent
                              ? 'bg-blue-600'
                              : 'bg-slate-200 dark:bg-slate-700'
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
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
