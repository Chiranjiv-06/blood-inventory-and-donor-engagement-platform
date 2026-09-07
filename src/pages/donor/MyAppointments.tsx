import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DonorAppointment } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  Navigation,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Building2,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const MyAppointments: React.FC = () => {
  const { appointments, cancelAppointment, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [cancelModalApt, setCancelModalApt] = useState<DonorAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Personal schedule conflict');
  const [directionsModalApt, setDirectionsModalApt] = useState<DonorAppointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'Upcoming') return apt.status === 'Confirmed';
    if (activeTab === 'Completed') return apt.status === 'Completed';
    if (activeTab === 'Cancelled') return apt.status === 'Cancelled' || apt.status === 'No Show';
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancelModalApt) {
      cancelAppointment(cancelModalApt.id, cancelReason);
      setCancelModalApt(null);
    }
  };

  const getStatusBadge = (status: DonorAppointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="medical" size="sm" dot>Confirmed</Badge>;
      case 'Completed':
        return <Badge variant="success" size="sm" dot>Completed</Badge>;
      case 'Cancelled':
      case 'No Show':
      default:
        return <Badge variant="danger" size="sm">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            My Donation Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View, reschedule, or cancel your scheduled blood and platelet harvest sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Donor_Appointments_${getTodayDateString()}`,
                filteredAppointments,
                [
                  { header: 'Appointment ID', accessor: 'id' },
                  { header: 'Facility Name', accessor: 'bloodBankName' },
                  { header: 'Facility Address', accessor: 'bloodBankAddress' },
                  { header: 'Date', accessor: 'date' },
                  { header: 'Time Slot', accessor: 'timeSlot' },
                  { header: 'Component Type', accessor: 'donationType' },
                  { header: 'Status', accessor: 'status' },
                  { header: 'Notes', accessor: (a) => a.notes || 'N/A' },
                ]
              );
              addToast({
                type: 'success',
                title: 'CSV Exported',
                message: `Exported ${filteredAppointments.length} appointment records.`,
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <Link
            to="/donor/book"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
          >
            <CalendarPlus className="w-4 h-4" /> Book New Appointment
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm">
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => {
          const count = appointments.filter((a) => {
            if (tab === 'Upcoming') return a.status === 'Confirmed';
            if (tab === 'Completed') return a.status === 'Completed';
            return a.status === 'Cancelled' || a.status === 'No Show';
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-blood-600 text-blood-600 dark:text-blood-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No {activeTab.toLowerCase()} appointments
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You do not have any appointments recorded under this filter.
            </p>
            {activeTab === 'Upcoming' && (
              <Link
                to="/donor/book"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blood-600 rounded-xl hover:bg-blood-700 transition-all"
              >
                <CalendarPlus className="w-4 h-4" /> Book Appointment Now
              </Link>
            )}
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blood-600 flex-shrink-0" />
                      {apt.bloodBankName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {apt.bloodBankAddress}
                    </p>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Date & Time Slot
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      📅 {apt.date}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      ⏰ {apt.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Donation Component
                    </span>
                    <span className="font-bold text-blood-600 dark:text-blood-400">
                      {apt.donationType}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Group: {apt.donorBloodGroup}
                    </span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-4">
                    Note: "{apt.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDirectionsModalApt(apt)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" /> Directions
                </button>

                {apt.status === 'Confirmed' ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/donor/book"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      Reschedule
                    </Link>
                    <button
                      onClick={() => setCancelModalApt(apt)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : apt.status === 'Completed' ? (
                  <Link
                    to="/donor/history"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Certificate
                  </Link>
                ) : (
                  <Link
                    to="/donor/book"
                    className="flex items-center gap-1 text-xs font-bold text-blood-600 dark:text-blood-400 hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Book Again
                  </Link>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Appointment Modal */}
      {cancelModalApt && (
        <Modal
          isOpen={!!cancelModalApt}
          onClose={() => setCancelModalApt(null)}
          title="Cancel Scheduled Appointment"
          subtitle={`Are you sure you want to cancel your session on ${cancelModalApt.date} at ${cancelModalApt.bloodBankName}?`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Personal schedule conflict">Personal schedule conflict</option>
                <option value="Feeling unwell / cold symptoms">Feeling unwell / cold symptoms</option>
                <option value="Rebooked at different center">Rebooked at different center</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Directions Modal */}
      {directionsModalApt && (
        <Modal
          isOpen={!!directionsModalApt}
          onClose={() => setDirectionsModalApt(null)}
          title="Facility Location & Transit Directions"
          subtitle={directionsModalApt.bloodBankName}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />
              <MapPin className="w-8 h-8 text-red-600 mb-2 animate-bounce" />
              <div className="font-bold text-slate-800 dark:text-slate-200 z-10">
                {directionsModalApt.bloodBankAddress}
              </div>
              <div className="text-[11px] text-slate-400 z-10 mt-1">
                Estimated Transit Time: ~14 mins via Central Health Express
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>🚗 <strong>Parking:</strong> Free donor visitor parking in Bay Area B.</p>
              <p>🏥 <strong>Check-in:</strong> Present your token BL-TOK at Reception Desk 1.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDirectionsModalApt(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-blood-600 rounded-xl hover:bg-blood-700"
              >
                Got It
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
