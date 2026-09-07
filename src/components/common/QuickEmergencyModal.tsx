import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';
import { Modal } from './Modal';
import { AlertCircle, Send, Siren } from 'lucide-react';

interface QuickEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickEmergencyModal: React.FC<QuickEmergencyModalProps> = ({ isOpen, onClose }) => {
  const { createEmergencyAlert, createHospitalRequest } = useApp();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Red Blood Cells');
  const [units, setUnits] = useState<number>(3);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Critical');
  const [hospitalName, setHospitalName] = useState('Central Trauma Emergency Wing');
  const [reason, setReason] = useState('Severe internal hemorrhage trauma patient (Code Red)');
  const [contactPhone, setContactPhone] = useState('+1 (555) 911-0422');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmergencyAlert({
      hospitalId: 'hosp_urgent_quick',
      hospitalName,
      hospitalAddress: '300 Emergency Center Parkway',
      distanceKm: 2.1,
      bloodGroup,
      component,
      unitsRequired: Number(units),
      urgency,
      requiredBy: 'Immediate / Next 45 Mins',
      reason,
      contactPerson: 'Emergency Desk Triage Officer',
      contactPhone,
    });

    createHospitalRequest({
      hospitalId: 'hosp_urgent_quick',
      hospitalName,
      hospitalLocation: 'Central Emergency Center',
      patientRefId: `PT-EMG-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup,
      component,
      quantityUnits: Number(units),
      urgency,
      requiredBy: new Date(Date.now() + 45 * 60000).toISOString().slice(0, 16).replace('T', ' '),
      notes: reason,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 Broadcast Emergency Blood Alert"
      subtitle="Immediately trigger priority notifications across matched donors and regional blood hubs."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <Siren className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5 animate-pulse" />
          <span>
            This triggers a real-time broadcast to all verified donors with matching compatibility and notifies nearby blood bank vaults.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Required Blood Group *
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
            >
              {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                <option key={bg} value={bg}>
                  {bg} {bg === 'O-' ? '(Universal RBC Donor)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Units Required *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Blood Component *
            </label>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value as BloodComponent)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
            >
              <option value="Whole Blood">Whole Blood</option>
              <option value="Red Blood Cells">Red Blood Cells (RBC)</option>
              <option value="Platelets">Platelets</option>
              <option value="Fresh Frozen Plasma">Fresh Frozen Plasma (FFP)</option>
              <option value="Cryoprecipitate">Cryoprecipitate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Urgency Level
            </label>
            <div className="flex gap-2">
              {(['Normal', 'Urgent', 'Critical'] as UrgencyLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    urgency === lvl
                      ? lvl === 'Critical'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : lvl === 'Urgent'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Hospital / Facility Name *
          </label>
          <input
            type="text"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Clinical Reason & Notes *
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Direct Emergency Contact Hotline *
          </label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            Dispatch Broadcast Now
          </button>
        </div>
      </form>
    </Modal>
  );
};
