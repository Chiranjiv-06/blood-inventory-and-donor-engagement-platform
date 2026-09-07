import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Package,
  AlertTriangle,
  Clock,
  Siren,
  Calendar,
  Users,
  Building2,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
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
} from 'recharts';

export const BloodBankOverview: React.FC = () => {
  const { inventory, appointments, emergencyAlerts, currentUser } = useApp();

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.quantityUnits, 0);
  const lowStockItems = inventory.filter((i) => i.isLowStock);
  const expiringSoonItems = inventory.filter((i) => i.isNearExpiry);
  const pendingEmergencies = emergencyAlerts.filter((a) => a.status === 'Open');
  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed').slice(0, 3);

  // Group inventory by blood group for Recharts
  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const chartData = bloodGroups.map((bg) => {
    const groupUnits = inventory
      .filter((i) => i.bloodGroup === bg)
      .reduce((acc, curr) => acc + curr.quantityUnits, 0);

    const safeThreshold = 8;
    return {
      name: bg,
      Available: groupUnits,
      SafeThreshold: safeThreshold,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentUser.name}
            </h1>
            <Badge variant="medical" size="sm" dot>
              Transfusion Facility
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time cold vault telemetry, donor queue scheduling, and hospital dispatch center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/bloodbank/inventory"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Blood Batch
          </Link>
        </div>
      </div>

      {/* Metric summary 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Blood Units */}
        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl shadow-inner flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total In-Stock Units
            </span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {totalUnits} Units
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Cold Vault: 3.8°C (Optimal)
            </span>
          </div>
        </Card>

        {/* Low-stock units */}
        <Card className="flex items-center gap-4 border-amber-200/70 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="w-13 h-13 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Low-Stock Warnings
            </span>
            <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {lowStockItems.length} Batches
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Below 5 units threshold
            </span>
          </div>
        </Card>

        {/* Expiring soon */}
        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Expiring in &lt; 7 Days
            </span>
            <h4 className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {expiringSoonItems.length} Units
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Prioritize for hospital orders
            </span>
          </div>
        </Card>

        {/* Pending Emergency Requests */}
        <Card className="flex items-center gap-4 border-red-200/70 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10">
          <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Emergencies
            </span>
            <h4 className="text-2xl font-black text-red-600 dark:text-red-400">
              {pendingEmergencies.length} Orders
            </h4>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
              Immediate triage action needed
            </span>
          </div>
        </Card>
      </div>

      {/* Main Chart Section: Inventory by Blood Group */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blood-600" />
              Real-Time Inventory Level by Blood Group
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison of current stock units vs. minimum safety threshold reserves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/bloodbank/inventory"
              className="text-xs font-semibold text-blood-600 dark:text-blood-400 hover:underline flex items-center gap-1"
            >
              Full Inventory Matrix &rarr;
            </Link>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Available" fill="#dc2626" radius={[6, 6, 0, 0]} name="In-Stock Units" />
              <Bar dataKey="SafeThreshold" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Safety Threshold" opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Lower Dual Grid: Recent Appointments & Emergency Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Today's Donor Queue
            </h3>
            <Link
              to="/bloodbank/appointments"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage Calendar ({appointments.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center border border-red-200 dark:border-red-900">
                    {apt.donorBloodGroup}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {apt.donorName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ⏰ {apt.timeSlot} &bull; {apt.donationType}
                    </p>
                  </div>
                </div>

                <Badge variant="medical" size="sm">
                  {apt.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Request Feed */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Siren className="w-4 h-4 text-red-600" /> Incoming Hospital Emergency Orders
            </h3>
            <Link
              to="/bloodbank/emergency-requests"
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
            >
              Fulfill Orders &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingEmergencies.slice(0, 2).map((emg) => (
              <Card
                key={emg.id}
                className="p-4 border-l-4 border-l-red-600 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
                      {emg.urgency} Requisition
                    </span>
                    <span className="text-[11px] text-slate-400">Deadline: {emg.requiredBy}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {emg.hospitalName} &bull; {emg.unitsRequired} Units ({emg.bloodGroup} {emg.component})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{emg.reason}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/bloodbank/emergency-requests"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-blood-600 hover:bg-blood-700 shadow-xs"
                  >
                    Allocate Units & Dispatach
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
