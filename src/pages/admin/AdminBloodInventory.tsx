import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Package, Search, Filter, AlertTriangle, Building2, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminBloodInventory: React.FC = () => {
  const { inventory, bloodBanks } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [bankFilter, setBankFilter] = useState('All');

  const filteredItems = inventory.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.unitCode.toLowerCase().includes(q) && !item.bloodGroup.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (bankFilter !== 'All' && item.bloodBankName !== bankFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blood-600" /> National Blood Inventory Aggregator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Supervise decentralized blood vaults, component reserves, and regional stock imbalances.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Admin_Inventory_${getTodayDateString()}`,
              filteredItems,
              [
                { header: 'Unit Code', accessor: 'unitCode' },
                { header: 'Blood Facility', accessor: 'bloodBankName' },
                { header: 'Blood Group', accessor: 'bloodGroup' },
                { header: 'Component', accessor: 'component' },
                { header: 'Available Units', accessor: 'quantityUnits' },
                { header: 'Volume (mL)', accessor: (i) => i.volumeMl || i.quantityUnits * 450 },
                { header: 'Collection Date', accessor: 'collectionDate' },
                { header: 'Expiry Date', accessor: 'expiryDate' },
                { header: 'Testing Status', accessor: 'testingStatus' },
                { header: 'Vault Location', accessor: 'locationStorage' },
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
              placeholder="Search barcode, blood group, or storage vault..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          <div>
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Blood Banks / Hubs</option>
              {bloodBanks.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Aggregated Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Batch Barcode</th>
                <th className="py-3.5 px-4">Blood Facility</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Component</th>
                <th className="py-3.5 px-4">Quantity Units</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Serology Status</th>
                <th className="py-3.5 px-4 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {item.unitCode}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.bloodBankName}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="blood" size="sm">
                      {item.bloodGroup}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {item.component}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                    {item.quantityUnits} Units
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {item.expiryDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm" dot>
                      {item.testingStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.availability}
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
