import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Building2, MapPin, Phone, Clock, CheckCircle2, Droplets, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';
import { Link } from 'react-router-dom';

export const MatchedBloodBanks: React.FC = () => {
  const { bloodBanks, addToast } = useApp();

  const handleAllocateDirect = (bankName: string) => {
    addToast({
      type: 'success',
      title: 'Blood Units Reserved',
      message: `Direct allocation token generated for ${bankName}. MediExpress courier alerted.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" /> Matched Regional Blood Vaults
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Certified centers with verified compatible stock ready for immediate surgical draw.
          </p>
        </div>

        <button
          onClick={() => {
            exportToCsv(
              `BloodLink_Matched_Facilities_${getTodayDateString()}`,
              bloodBanks,
              [
                { header: 'Facility ID', accessor: 'id' },
                { header: 'Facility Name', accessor: 'name' },
                { header: 'Type', accessor: 'type' },
                { header: 'Address', accessor: 'address' },
                { header: 'City', accessor: 'city' },
                { header: 'Distance (km)', accessor: 'distanceKm' },
                { header: 'Contact Phone', accessor: 'phone' },
                { header: 'Emergency Service Available', accessor: (b) => (b.emergencyService ? 'Yes (24/7)' : 'No') },
                { header: 'Verification Status', accessor: (b) => (b.verified ? 'Verified' : 'Pending') },
              ]
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bloodBanks.map((bank) => (
          <Card key={bank.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {bank.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {bank.address}, {bank.city} &bull;{' '}
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {bank.distanceKm} km away
                    </span>
                  </p>
                </div>

                <Badge variant="success" size="sm" dot>
                  Direct Stock Match
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Estimated Transit ETA
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    ~{Math.round(bank.distanceKm * 4 + 8)} Mins (ColdLink)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Direct Transfusion Hotline
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {bank.phone}
                  </span>
                </div>
              </div>

              {/* Real time stock preview */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Available Tested Stock:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {Object.entries(bank.availableStock).slice(0, 4).map(([grp, qty]) => (
                    <div
                      key={grp}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
                    >
                      <span className="font-black text-xs block">{grp}</span>
                      <span className="text-[11px] font-semibold">{qty} Units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={`tel:${bank.phone}`}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blood-600 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call Dispatch Desk
              </a>

              <button
                onClick={() => handleAllocateDirect(bank.name)}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all"
              >
                Direct Allocate Stock
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
