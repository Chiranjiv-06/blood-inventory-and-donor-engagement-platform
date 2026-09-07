import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  PlusCircle,
  Hospital,
  AlertCircle,
  Siren,
  Clock,
  User,
  Droplet,
  Send,
  Calendar,
} from 'lucide-react';

export const CreateBloodRequest: React.FC = () => {
  const { createHospitalRequest, currentUser, addToast } = useApp();
  const navigate = useNavigate();

  const [patientRefId, setPatientRefId] = useState(`PT-TRAUMA-${Math.floor(10000 + Math.random() * 90000)}`);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Red Blood Cells');
  const [quantityUnits, setQuantityUnits] = useState<number>(4);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Critical');
  const [requiredBy, setRequiredBy] = useState(
    new Date(Date.now() + 60 * 60000).toISOString().slice(0, 16).replace('T', ' ')
  );
  const [notes, setNotes] = useState('Emergency trauma surgery patient admitted to ICU Bay 2.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createHospitalRequest({
      hospitalId: currentUser.id,
      hospitalName: currentUser.name,
      hospitalLocation: currentUser.location,
      patientRefId,
      bloodGroup,
      component,
      quantityUnits: Number(quantityUnits),
      urgency,
      requiredBy,
      notes,
    });

    navigate('/hospital/requests');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Create Clinical Blood Requisition
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Issue priority orders to the regional blood grid with automated stock matching and live dispatch tracking.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Urgency Selector Header */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Clinical Urgency Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  lvl: 'Normal' as UrgencyLevel,
                  label: 'Normal Elective',
                  desc: 'Scheduled surgeries within 24-48h',
                  color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
                },
                {
                  lvl: 'Urgent' as UrgencyLevel,
                  label: 'Urgent Priority',
                  desc: 'Required within 2 to 4 hours',
                  color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
                },
                {
                  lvl: 'Critical' as UrgencyLevel,
                  label: 'Critical Code Red',
                  desc: 'Trauma resuscitation (< 45 mins)',
                  color: 'border-red-600 bg-red-50/70 dark:bg-red-950/50 text-red-700 dark:text-red-300',
                },
              ].map((u) => (
                <div
                  key={u.lvl}
                  onClick={() => setUrgency(u.lvl)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    urgency === u.lvl ? `${u.color} ring-2 ring-red-500/20 shadow-xs` : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm">{u.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{u.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient Ref ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Patient Medical Reference ID *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={patientRefId}
                  onChange={(e) => setPatientRefId(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Required Blood Group *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              >
                {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal RBC)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Component */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Blood Component *
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              >
                <option value="Whole Blood">Whole Blood</option>
                <option value="Red Blood Cells">Red Blood Cells (RBC)</option>
                <option value="Platelets">Platelets</option>
                <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
              </select>
            </div>

            {/* Quantity Needed */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantity Units Required *
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={quantityUnits}
                onChange={(e) => setQuantityUnits(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              />
            </div>

            {/* Required by Date/Time */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Required By Date & Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={requiredBy}
                  onChange={(e) => setRequiredBy(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM or 'Immediate'"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Indication & Surgical Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              ⚡ Automated routing algorithm will instantly match certified blood banks with available stock.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-lg shadow-red-500/25 transition-all"
            >
              <Send className="w-4 h-4" /> Dispatch Blood Requisition
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
