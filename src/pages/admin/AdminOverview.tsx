import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  ShieldCheck,
  Users,
  Building2,
  Hospital,
  Package,
  AlertTriangle,
  Siren,
  TrendingUp,
  Activity,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const { inventory, bloodBanks, emergencyAlerts, hospitalRequests } = useApp();

  const totalInventoryUnits = inventory.reduce((acc, curr) => acc + curr.quantityUnits, 0) + 140;
  const criticalAlertsCount = emergencyAlerts.filter((a) => a.status === 'Open').length;

  const bloodGroupDistribution = [
    { group: 'O+', units: 48, safeMin: 20 },
    { group: 'O-', units: 12, safeMin: 15 },
    { group: 'A+', units: 38, safeMin: 20 },
    { group: 'A-', units: 14, safeMin: 15 },
    { group: 'B+', units: 32, safeMin: 20 },
    { group: 'B-', units: 9, safeMin: 12 },
    { group: 'AB+', units: 18, safeMin: 10 },
    { group: 'AB-', units: 6, safeMin: 8 },
  ];

  const fulfillmentTrend = [
    { day: 'Mon', requested: 24, fulfilled: 24 },
    { day: 'Tue', requested: 32, fulfilled: 30 },
    { day: 'Wed', requested: 28, fulfilled: 28 },
    { day: 'Thu', requested: 40, fulfilled: 38 },
    { day: 'Fri', requested: 36, fulfilled: 35 },
    { day: 'Sat', requested: 22, fulfilled: 22 },
    { day: 'Sun', requested: 18, fulfilled: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              National Transfusion Regulatory Supervision
            </h1>
            <Badge variant="success" size="sm" dot>
              Super Admin Console
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global healthcare network oversight, blood shortage surveillance, and regulatory audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-all"
          >
            <FileText className="w-4 h-4" /> Export Regulatory Audit
          </Link>
        </div>
      </div>

      {/* 6 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Donors
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            1,428
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +38 this week
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Blood Banks
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            22 Hubs
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
            100% Certified
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Hospitals
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            18 Centers
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            Trauma Level-1/2
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Inventory
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalInventoryUnits} Units
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Across 22 vaults
          </span>
        </Card>

        <Card className="p-4 border-amber-200/80 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Shortage Alerts
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            3 Groups
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            O-, B-, AB- Alert
          </span>
        </Card>

        <Card className="p-4 border-red-200/80 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Emergency Calls
          </span>
          <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 mt-1">
            {criticalAlertsCount} Open
          </div>
          <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">
            Active priority
          </span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* National Inventory by Blood Group Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              National Stock Balance by Blood Group
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Aggregated units available across regional vaults vs. national security minimums.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodGroupDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="units" fill="#dc2626" radius={[6, 6, 0, 0]} name="Vault Stock Units" />
                  <Bar dataKey="safeMin" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Safety Threshold" opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Weekly Request Fulfillment Line Chart */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Weekly Requisition Fulfillment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Trauma requests dispatched vs. requested volume.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fulfillmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="requested" stroke="#94a3b8" strokeWidth={2} name="Requested" />
                  <Line type="monotone" dataKey="fulfilled" stroke="#059669" strokeWidth={2.5} name="Fulfilled" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
