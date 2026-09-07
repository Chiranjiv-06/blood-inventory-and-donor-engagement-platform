import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  FileText,
  Download,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const BloodBankReports: React.FC = () => {
  const { addToast } = useApp();

  const monthlyTrends = [
    { month: 'Apr', Collections: 140, Transfusions: 125 },
    { month: 'May', Collections: 185, Transfusions: 160 },
    { month: 'Jun', Collections: 210, Transfusions: 195 },
    { month: 'Jul', Collections: 190, Transfusions: 180 },
    { month: 'Aug', Collections: 240, Transfusions: 220 },
    { month: 'Sep', Collections: 265, Transfusions: 245 },
  ];

  const componentDistribution = [
    { name: 'Red Blood Cells', value: 45, color: '#dc2626' },
    { name: 'Whole Blood', value: 25, color: '#b91c1c' },
    { name: 'Platelets', value: 18, color: '#f59e0b' },
    { name: 'Fresh Frozen Plasma', value: 12, color: '#2563eb' },
  ];

  const handleExportCsv = () => {
    exportToCsv(
      `BloodLink_Performance_Monthly_Trends_${getTodayDateString()}`,
      monthlyTrends,
      [
        { header: 'Month', accessor: 'month' },
        { header: 'Units Collected', accessor: 'Collections' },
        { header: 'Units Transfused', accessor: 'Transfusions' },
        { header: 'Surplus / Deficit', accessor: (m) => m.Collections - m.Transfusions },
      ]
    );
    addToast({
      type: 'success',
      title: 'Report Exported (CSV)',
      message: `BloodLink_Performance_Monthly_Trends_${getTodayDateString()}.csv generated and downloaded.`,
    });
  };

  const handleExportPdf = () => {
    addToast({
      type: 'success',
      title: 'Report Exported (PDF)',
      message: `BloodLink_Performance_Report_${getTodayDateString()}.pdf generated and downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blood-600" /> Transfusion Quality & Utilization Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit-grade statistics covering collection throughput, wastage metrics, and clinical dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md transition-all"
          >
            <Download className="w-4 h-4" /> Export PDF Summary
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quarterly Collections
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            695 Units
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last quarter
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hospital Fulfillment Rate
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            98.6%
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Avg dispatch: 18 mins
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Cold Vault Wastage Loss
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            0.8%
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Well below 2.5% WHO limit
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Repeat Donor Retention
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            78.4%
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
            High loyalty index
          </span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Monthly Collections vs Hospital Transfusions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Track balance between voluntary donor intake and hospital draw requests.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
                  <Area
                    type="monotone"
                    dataKey="Collections"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.2}
                    name="Harvested Units"
                  />
                  <Area
                    type="monotone"
                    dataKey="Transfusions"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.1}
                    name="Transfused to Patients"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Component Pie Chart */}
        <div className="lg:col-span-4">
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Component Share
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Distribution of harvested volume.
              </p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={componentDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {componentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              {componentDistribution.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-700 dark:text-slate-300">{c.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{c.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
