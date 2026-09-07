import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Heart,
  Droplet,
  Send,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const DonorDirectory: React.FC = () => {
  const { donorsDirectory, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [filterEligibility, setFilterEligibility] = useState<string>('All');
  const [selectedDonor, setSelectedDonor] = useState<typeof donorsDirectory[0] | null>(null);

  const filteredDonors = donorsDirectory.filter((d) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchLoc = d.location.toLowerCase().includes(q);
      if (!matchName && !matchLoc) return false;
    }
    if (filterGroup !== 'All' && d.bloodGroup !== filterGroup) return false;
    if (filterEligibility !== 'All' && d.eligibility !== filterEligibility) return false;
    return true;
  });

  const handleContact = (d: typeof donorsDirectory[0]) => {
    addToast({
      type: 'success',
      title: 'Donor Alert Dispatched',
      message: `Priority donation appeal SMS sent to ${d.name} (${d.phone}).`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Voluntary Donor Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search and mobilize registered lifesavers categorized by blood group, last donation, and medical clearance.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Donor_Directory_${getTodayDateString()}`,
              filteredDonors,
              [
                { header: 'Donor ID', accessor: 'id' },
                { header: 'Full Name', accessor: 'name' },
                { header: 'Blood Group', accessor: 'bloodGroup' },
                { header: 'Phone', accessor: 'phone' },
                { header: 'Email', accessor: 'email' },
                { header: 'Location Zone', accessor: 'location' },
                { header: 'Total Donations', accessor: 'totalDonations' },
                { header: 'Last Donation Date', accessor: 'lastDonation' },
                { header: 'Eligibility Status', accessor: 'eligibility' },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by donor name or location..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          <div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Blood Groups</option>
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterEligibility}
              onChange={(e) => setFilterEligibility(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Eligibility States</option>
              <option value="Eligible">Eligible Now</option>
              <option value="Temporarily Ineligible">Temporarily Ineligible</option>
              <option value="Needs Review">Needs Medical Review</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Donors Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Donor Profile</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Location Zone</th>
                <th className="py-3.5 px-4">Total Donations</th>
                <th className="py-3.5 px-4">Last Donated</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDonors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {d.name}
                      {d.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{d.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="blood" size="sm">
                      {d.bloodGroup}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {d.location}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {d.totalDonations} Sessions
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {d.lastDonation}
                  </td>

                  <td className="py-3.5 px-4">
                    {d.eligibility === 'Eligible' ? (
                      <Badge variant="success" size="sm" dot>
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        {d.eligibility}
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleContact(d)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-xs transition-all flex items-center gap-1"
                        title="Send urgent donation SMS"
                      >
                        <Send className="w-3 h-3" /> Mobilize
                      </button>
                      <button
                        onClick={() => setSelectedDonor(d)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Donor Details Drawer Modal */}
      {selectedDonor && (
        <Modal
          isOpen={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
          title="Donor Healthcare Profile"
          subtitle={`Verified Donor Record #${selectedDonor.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                {selectedDonor.bloodGroup}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedDonor.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedDonor.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success" size="sm">
                    {selectedDonor.eligibility}
                  </Badge>
                  <span className="text-[11px] text-slate-500">
                    Preferred: {selectedDonor.preferredComponent}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Phone Hotline:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDonor.phone}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Total Donations:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDonor.totalDonations} Completed (~{selectedDonor.totalDonations * 3} lives)
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleContact(selectedDonor);
                  setSelectedDonor(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md"
              >
                Dispatch Appeal SMS
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
