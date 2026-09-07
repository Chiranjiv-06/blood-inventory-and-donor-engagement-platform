import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FileText, Download, Search, Filter, ShieldCheck, Terminal, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminAuditLogsReports: React.FC = () => {
  const { auditLogs, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!log.userName.toLowerCase().includes(q) && !log.action.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (roleFilter !== 'All' && log.userRole !== roleFilter) return false;
    return true;
  });

  const handleExport = () => {
    exportToCsv(
      `BloodLink_Admin_Audit_Trail_${getTodayDateString()}`,
      filteredLogs,
      [
        { header: 'Log ID', accessor: 'id' },
        { header: 'User Name', accessor: 'userName' },
        { header: 'User Role', accessor: 'userRole' },
        { header: 'Action', accessor: 'action' },
        { header: 'Entity Type', accessor: 'entityType' },
        { header: 'Entity ID', accessor: 'entityId' },
        { header: 'IP Address', accessor: 'ipAddress' },
        { header: 'Event Details', accessor: 'details' },
        { header: 'Status', accessor: 'status' },
        { header: 'Timestamp', accessor: 'timestamp' },
      ]
    );
    addToast({
      type: 'success',
      title: 'Audit Logs Exported',
      message: `BloodLink_Admin_Audit_Trail_${getTodayDateString()}.csv generated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" /> Regulatory Audit Trail & Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cryptographically sealed immutable ledger tracking all user actions, serology releases, and emergency calls.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl shadow-md transition-all self-start"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV Audit Logs
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search action keyword, operator name, or entity ID..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Operator Roles</option>
              <option value="hospital">Hospital Staff</option>
              <option value="bloodbank">Blood Bank Technicians</option>
              <option value="admin">Super Administrators</option>
              <option value="donor">Donors</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Action Code</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Action Details</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {log.userRole}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success" size="sm" dot>
                      Verified
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
