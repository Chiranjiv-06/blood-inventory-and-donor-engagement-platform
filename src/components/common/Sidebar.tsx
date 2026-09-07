import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  User,
  CheckCircle2,
  CalendarPlus,
  Calendar,
  History,
  AlertOctagon,
  MapPin,
  Bell,
  Settings,
  Package,
  Users,
  Repeat,
  FileText,
  Hospital,
  PlusCircle,
  Clock,
  Building,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Droplets,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onOpenRoleSwitcher: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenRoleSwitcher,
}) => {
  const { currentRole, currentUser, emergencyAlerts, inventory, hospitalRequests } = useApp();

  const unhandledEmergencyCount = emergencyAlerts.filter((a) => a.status === 'Open').length;
  const lowStockCount = inventory.filter((i) => i.isLowStock || i.isNearExpiry).length;
  const criticalHospitalCount = hospitalRequests.filter((r) => r.urgency === 'Critical' && r.status !== 'Fulfilled').length;

  const donorLinks = [
    { to: '/donor', label: 'Overview', icon: Heart, exact: true },
    { to: '/donor/profile', label: 'My Profile', icon: User },
    { to: '/donor/eligibility', label: 'Eligibility Check', icon: CheckCircle2 },
    { to: '/donor/book', label: 'Book Donation', icon: CalendarPlus, highlight: true },
    { to: '/donor/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/donor/history', label: 'Donation History', icon: History },
    { to: '/donor/emergency-alerts', label: 'Emergency Alerts', icon: AlertOctagon, badge: unhandledEmergencyCount > 0 ? `${unhandledEmergencyCount} Critical` : undefined, badgeColor: 'bg-red-500 text-white' },
    { to: '/donor/nearby', label: 'Nearby Blood Banks', icon: MapPin },
    { to: '/donor/notifications', label: 'Notifications', icon: Bell },
    { to: '/donor/settings', label: 'Settings', icon: Settings },
  ];

  const bloodBankLinks = [
    { to: '/bloodbank', label: 'Overview', icon: Layers, exact: true },
    { to: '/bloodbank/inventory', label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined, badgeColor: 'bg-amber-500 text-white' },
    { to: '/bloodbank/donors', label: 'Donors', icon: Users },
    { to: '/bloodbank/appointments', label: 'Appointments', icon: Calendar },
    { to: '/bloodbank/emergency-requests', label: 'Emergency Requests', icon: AlertOctagon, badge: unhandledEmergencyCount > 0 ? `${unhandledEmergencyCount}` : undefined, badgeColor: 'bg-red-500 text-white' },
    { to: '/bloodbank/transfers', label: 'Transfers', icon: Repeat },
    { to: '/bloodbank/reports', label: 'Reports', icon: FileText },
    { to: '/bloodbank/notifications', label: 'Notifications', icon: Bell },
    { to: '/bloodbank/settings', label: 'Settings', icon: Settings },
  ];

  const hospitalLinks = [
    { to: '/hospital', label: 'Overview', icon: Hospital, exact: true },
    { to: '/hospital/create-request', label: 'Create Blood Request', icon: PlusCircle, highlight: true },
    { to: '/hospital/requests', label: 'My Requests', icon: Clock },
    { to: '/hospital/matched-banks', label: 'Matched Blood Banks', icon: Building },
    { to: '/hospital/emergency', label: 'Emergency Requests', icon: AlertOctagon, badge: criticalHospitalCount > 0 ? `${criticalHospitalCount}` : undefined, badgeColor: 'bg-red-500 text-white' },
    { to: '/hospital/notifications', label: 'Notifications', icon: Bell },
    { to: '/hospital/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: Activity, exact: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/organizations', label: 'Organizations', icon: Building },
    { to: '/admin/inventory', label: 'Blood Inventory', icon: Package },
    { to: '/admin/emergency', label: 'Emergency Requests', icon: AlertOctagon },
    { to: '/admin/verification', label: 'Verification', icon: ShieldCheck },
    { to: '/admin/fraud-flags', label: 'Fraud Flags', icon: ShieldAlert, badge: '3 Flags', badgeColor: 'bg-rose-600 text-white' },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  let currentNavItems = donorLinks;
  let roleTitle = 'Donor Portal';
  let roleColor = 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900';

  if (currentRole === 'bloodbank') {
    currentNavItems = bloodBankLinks;
    roleTitle = 'Blood Bank';
    roleColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900';
  } else if (currentRole === 'hospital') {
    currentNavItems = hospitalLinks;
    roleTitle = 'Hospital Desk';
    roleColor = 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-900';
  } else if (currentRole === 'admin') {
    currentNavItems = adminLinks;
    roleTitle = 'Super Admin';
    roleColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 flex-shrink-0">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                  BloodLink
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Real-time Network
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Persona Card & Switcher */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <div
            onClick={onOpenRoleSwitcher}
            className={`cursor-pointer rounded-xl p-2.5 transition-all duration-200 border ${
              collapsed ? 'text-center' : 'flex items-center justify-between'
            } bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80`}
            title="Click to Switch Portal Persona"
          >
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${roleColor}`}>
                    {roleTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-blood-600 dark:text-blood-400">
                  <Sparkles className="w-3.5 h-3.5" /> Switch
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <Sparkles className="w-5 h-5 text-blood-600" />
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blood-50 dark:bg-red-950/40 text-blood-700 dark:text-red-300 font-semibold shadow-xs border border-red-100 dark:border-red-900/50'
                      : item.highlight
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    item.highlight ? 'text-white' : ''
                  }`}
                />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile Summary */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blood-600 to-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
              {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
