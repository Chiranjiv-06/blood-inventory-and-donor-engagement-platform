import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Modal } from './Modal';
import { Heart, Building2, Hospital, ShieldCheck, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setRole } = useApp();
  const navigate = useNavigate();

  const roles: {
    id: UserRole;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    path: string;
  }[] = [
    {
      id: 'donor',
      title: 'Blood Donor Portal',
      description: 'Book appointments, view donation history, check medical eligibility, and respond to urgent hospital appeals.',
      icon: Heart,
      color: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900',
      path: '/donor',
    },
    {
      id: 'bloodbank',
      title: 'Blood Bank / Transfusion Center',
      description: 'Manage cold vault inventory, blood testing batches, donor check-in calendar, and emergency hospital orders.',
      icon: Building2,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      path: '/bloodbank',
    },
    {
      id: 'hospital',
      title: 'Hospital / Trauma Center',
      description: 'Issue urgent and normal patient blood requisitions, track live delivery timeline, and find matched blood banks.',
      icon: Hospital,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-900',
      path: '/hospital',
    },
    {
      id: 'admin',
      title: 'Super Admin Regulatory Portal',
      description: 'National blood safety supervision, facility verification, fraud flag investigations, and audit trails.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      path: '/admin',
    },
  ];

  const handleSelect = (roleId: UserRole, path: string) => {
    setRole(roleId);
    navigate(path);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Active Persona"
      subtitle="Easily explore BloodLink from any user or organization perspective."
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 gap-3">
        {roles.map((r) => {
          const isSelected = currentRole === r.id;
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              onClick={() => handleSelect(r.id, r.path)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-blood-600 bg-red-50/40 dark:bg-red-950/20 shadow-sm ring-1 ring-blood-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className={`p-3 rounded-xl border ${r.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                    {r.title}
                  </h4>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blood-600 dark:text-blood-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
