import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  Siren,
  User,
  LogOut,
  Sparkles,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { QuickEmergencyModal } from './QuickEmergencyModal';
import { RoleSwitcherModal } from './RoleSwitcherModal';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenNotifications,
}) => {
  const { currentUser, currentRole, notifications, setRole, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumbs generator
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const formattedBreadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return { label: formatted, url };
  });

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search routing helper
    const query = searchQuery.toLowerCase();
    if (query.includes('o+') || query.includes('o-') || query.includes('a+') || query.includes('blood') || query.includes('unit')) {
      if (currentRole === 'donor') navigate('/donor/nearby');
      else if (currentRole === 'bloodbank') navigate('/bloodbank/inventory');
      else navigate('/hospital/matched-banks');
    } else if (query.includes('appoint') || query.includes('book')) {
      navigate(currentRole === 'donor' ? '/donor/appointments' : '/bloodbank/appointments');
    } else if (query.includes('emergency') || query.includes('urgent')) {
      navigate(`/${currentRole}/emergency-alerts`);
    } else {
      navigate(`/${currentRole}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Mobile toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link
              to={`/${currentRole}`}
              className="flex items-center gap-1 hover:text-blood-600 dark:hover:text-blood-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>
            {formattedBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <span
                  className={
                    idx === formattedBreadcrumbs.length - 1
                      ? 'font-semibold text-slate-800 dark:text-slate-200'
                      : 'hover:text-slate-700 dark:hover:text-slate-300'
                  }
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <form onSubmit={handleGlobalSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blood groups (O+, A-), donors, hospitals, or requests..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blood-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </form>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Emergency Fast Broadcast Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-sm shadow-red-500/25 transition-all animate-pulse-subtle"
            title="Dispatch emergency blood request"
          >
            <Siren className="w-4 h-4" />
            <span className="hidden sm:inline">Emergency Alert</span>
          </button>

          {/* Persona Switcher Quick Trigger */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Switch Role</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blood-600 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'BL'}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && currentUser && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-up"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                    {currentUser.verificationStatus === 'Verified' && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to={`/${currentUser.role}/profile`}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Account Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out to Landing Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <QuickEmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
