import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockTransfer, BloodGroup, BloodComponent } from '../../types';
import { mockStockTransfers } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Repeat, PlusCircle, ArrowRight, Truck, Thermometer, CheckCircle2, Clock, FileSpreadsheet } from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const BloodTransfers: React.FC = () => {
  const { bloodBanks, addToast } = useApp();
  const [transfers, setTransfers] = useState<StockTransfer[]>(mockStockTransfers);
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);

  const [toBank, setToBank] = useState('Saint Jude Regional Transfusion Center');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Red Blood Cells');
  const [units, setUnits] = useState<number>(4);

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrf: StockTransfer = {
      id: 'trf_' + Date.now(),
      transferId: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fromBank: 'Metropolitan Red Cross Blood Hub',
      toBank,
      bloodGroup,
      component,
      quantityUnits: Number(units),
      dispatchDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'In Transit',
      courierName: 'MediExpress ColdLink Unit 7',
      trackingTempCelsius: 3.2,
    };

    setTransfers([newTrf, ...transfers]);
    setIsNewTransferOpen(false);
    addToast({
      type: 'success',
      title: 'Transfer Dispatched',
      message: `${units} units of ${bloodGroup} dispatched to ${toBank}. Courier tracking active.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-6 h-6 text-blue-600" /> Inter-Facility Stock Transfers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Regulate cold-chain logistics transfers between partner transfusion vaults and hospitals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Stock_Transfers_${getTodayDateString()}`,
                transfers,
                [
                  { header: 'Transfer ID', accessor: 'transferId' },
                  { header: 'Source Facility', accessor: 'fromBank' },
                  { header: 'Destination Facility', accessor: 'toBank' },
                  { header: 'Blood Group', accessor: 'bloodGroup' },
                  { header: 'Component', accessor: 'component' },
                  { header: 'Quantity (Units)', accessor: 'quantityUnits' },
                  { header: 'Dispatch Date', accessor: 'dispatchDate' },
                  { header: 'Courier / Fleet', accessor: 'courierName' },
                  { header: 'Temperature (°C)', accessor: (t) => `${t.trackingTempCelsius}°C` },
                  { header: 'Status', accessor: 'status' },
                ]
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={() => setIsNewTransferOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Request / Dispatch Transfer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {transfers.map((trf) => (
          <Card key={trf.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {trf.transferId}
                  </span>
                  <Badge variant={trf.status === 'In Transit' ? 'warning' : 'success'} size="sm" dot>
                    {trf.status}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Dispatched: {trf.dispatchDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  <span>{trf.fromBank}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-blue-600 dark:text-blue-400">{trf.toBank}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-blood-600 dark:text-blood-400">
                    {trf.quantityUnits} Units of {trf.bloodGroup} ({trf.component})
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Courier: {trf.courierName}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Thermometer className="w-3.5 h-3.5" /> Live Temp: {trf.trackingTempCelsius}°C
                  </span>
                </div>
              </div>

              {trf.status === 'In Transit' && (
                <button
                  onClick={() => {
                    setTransfers(
                      transfers.map((t) => (t.id === trf.id ? { ...t, status: 'Received' } : t))
                    );
                    addToast({
                      type: 'success',
                      title: 'Transfer Received',
                      message: `${trf.transferId} marked as received into recipient vault.`,
                    });
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-all self-start lg:self-center"
                >
                  Mark Received
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isNewTransferOpen && (
        <Modal
          isOpen={isNewTransferOpen}
          onClose={() => setIsNewTransferOpen(false)}
          title="Initiate Inter-Facility Cold Chain Transfer"
          subtitle="Prepare certified courier transport for emergency unit replenishment."
          maxWidth="md"
        >
          <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Destination Blood Bank or Hospital
              </label>
              <select
                value={toBank}
                onChange={(e) => setToBank(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {bloodBanks.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quantity Units
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTransferOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                Dispatch Transport
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
