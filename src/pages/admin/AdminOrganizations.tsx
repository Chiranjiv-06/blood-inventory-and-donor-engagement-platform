import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminOrganizations: React.FC = () => {
  const { organizations, updateOrgStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedOrg, setSelectedOrg] = useState<typeof organizations[0] | null>(null);

  const filteredOrgs = organizations.filter((org) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!org.name.toLowerCase().includes(q) && !org.city.toLowerCase().includes(q) && !org.license.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (typeFilter !== 'All' && org.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Accredited Healthcare Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Medical center compliance licenses, cold storage capacities, and regulatory approval records.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Admin_Organizations_${getTodayDateString()}`,
              filteredOrgs,
              [
                { header: 'Facility ID', accessor: 'id' },
                { header: 'Organization Name', accessor: 'name' },
                { header: 'Facility Type', accessor: 'type' },
                { header: 'City', accessor: 'city' },
                { header: 'Bed Capacity', accessor: 'beds' },
                { header: 'Active Blood Units', accessor: 'activeUnits' },
                { header: 'Regulatory License', accessor: 'license' },
                { header: 'Status', accessor: 'status' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
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
              placeholder="Search facility name, license ID, or city..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Facility Types</option>
              <option value="Blood Bank">Blood Banks / Hubs</option>
              <option value="Hospital">Hospitals / Trauma Centers</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Organization Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Organization Name</th>
                <th className="py-3.5 px-4">Facility Type</th>
                <th className="py-3.5 px-4">Regulatory License</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Capacity Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{org.name}</div>
                    <div className="text-[11px] text-slate-400">Joined: {org.joinedDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        org.type === 'Blood Bank'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}
                    >
                      {org.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {org.license}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {org.city}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {org.activeUnits} Units ({org.beds} Beds)
                  </td>

                  <td className="py-3.5 px-4">
                    {org.status === 'Active' ? (
                      <Badge variant="success" size="sm" dot>
                        Certified Active
                      </Badge>
                    ) : org.status === 'Pending Verification' ? (
                      <Badge variant="warning" size="sm" dot>
                        Pending Review
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm">
                        Suspended
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {org.status === 'Pending Verification' && (
                        <button
                          onClick={() => updateOrgStatus(org.id, 'Active')}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          Verify & Grant License
                        </button>
                      )}
                      {org.status === 'Active' && (
                        <button
                          onClick={() => updateOrgStatus(org.id, 'Suspended')}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Suspend
                        </button>
                      )}
                      {org.status === 'Suspended' && (
                        <button
                          onClick={() => updateOrgStatus(org.id, 'Active')}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          Reinstate
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrg(org)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Organization Inspection Modal */}
      {selectedOrg && (
        <Modal
          isOpen={!!selectedOrg}
          onClose={() => setSelectedOrg(null)}
          title={`Facility Compliance Record: ${selectedOrg.name}`}
          subtitle={`License ID: ${selectedOrg.license}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Clinical Type:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrg.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Regional District:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedOrg.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bed & Cold Vault Capacity:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedOrg.activeUnits} Units / {selectedOrg.beds} Beds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compliance Inspection:</span>
                <span className="font-bold text-emerald-600">Passed ISO 15189 Standards</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
