import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DonorAppointment } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  List,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  FileCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const BloodBankAppointments: React.FC = () => {
  const { appointments, updateAppointmentStatus, addToast } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<DonorAppointment | null>(null);
  const [vitalNotes, setVitalNotes] = useState('Hb: 14.5 g/dL, BP: 120/80 mmHg, Draw: 450ml clean.');

  const handleStatusChange = (id: string, status: DonorAppointment['status']) => {
    updateAppointmentStatus(id, status);
  };

  const handleCompleteCheckin = (apt: DonorAppointment) => {
    updateAppointmentStatus(apt.id, 'Completed');
    addToast({
      type: 'success',
      title: 'Donation Completed & Unit Harvested',
      message: `450ml draw from ${apt.donorName} (${apt.donorBloodGroup}) marked completed and sent to quarantine testing.`,
    });
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Donor Appointment Scheduling & Intake
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor donor arrivals, verify vital clearances, and track appointment completions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Facility_Appointments_${getTodayDateString()}`,
                appointments,
                [
                  { header: 'Appointment ID', accessor: 'id' },
                  { header: 'Donor Name', accessor: 'donorName' },
                  { header: 'Donor Blood Group', accessor: 'donorBloodGroup' },
                  { header: 'Donor Phone', accessor: 'donorPhone' },
                  { header: 'Appointment Date', accessor: 'date' },
                  { header: 'Time Slot', accessor: 'timeSlot' },
                  { header: 'Component Type', accessor: 'donationType' },
                  { header: 'Status', accessor: 'status' },
                  { header: 'Notes', accessor: (a) => (a as any).notes || 'N/A' },
                ]
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> Calendar
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Date & Time Slot</th>
                  <th className="py-3.5 px-4">Donation Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions & Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{apt.donorName}</div>
                      <div className="text-[11px] text-slate-400">{apt.donorPhone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="blood" size="sm">
                        {apt.donorBloodGroup}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{apt.date}</div>
                      <div className="text-[11px] text-slate-400">⏰ {apt.timeSlot}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {apt.donationType}
                    </td>

                    <td className="py-3.5 px-4">
                      {apt.status === 'Confirmed' ? (
                        <Badge variant="medical" size="sm" dot>
                          Confirmed
                        </Badge>
                      ) : apt.status === 'Completed' ? (
                        <Badge variant="success" size="sm" dot>
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          {apt.status}
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1"
                            >
                              <FileCheck className="w-3 h-3" /> Check-in Draw
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'No Show')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              No-Show
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                            className="px-3 py-1 text-xs font-medium text-slate-500 hover:underline"
                          >
                            Re-Open
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Calendar View Simulator */
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              September 2026 Collection Calendar
            </h3>
            <span className="text-xs text-slate-400">8 Scheduled Slots Today</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-slate-400 py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const hasApts = dayNum === 5 || dayNum === 6 || dayNum === 8 || dayNum === 12;

              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-left min-h-[70px] transition-all ${
                    dayNum === 5
                      ? 'border-blood-600 bg-red-50/50 dark:bg-red-950/30'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">{dayNum}</div>
                  {hasApts && (
                    <div className="space-y-1">
                      <span className="block text-[9px] font-semibold text-blood-600 dark:text-blood-400 bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded-sm truncate">
                        {dayNum === 5 ? '3 Donors (Today)' : '2 Donors'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Intake Check-In Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Clinical Donor Intake & Blood Draw Verification"
          subtitle={`Record collection vitals for ${selectedAppointment.donorName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Donor Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.donorName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Blood Group:</span>
                <Badge variant="blood" size="sm">
                  {selectedAppointment.donorBloodGroup}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pre-Draw Vitals & Lab Verification Notes
              </label>
              <textarea
                rows={3}
                value={vitalNotes}
                onChange={(e) => setVitalNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteCheckin(selectedAppointment)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Draw & Complete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
