import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, AccountStatus, UserProfile, VerificationStatus, BloodGroup } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Lock,
  Clock,
  Ban,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  FileSpreadsheet,
  Edit3,
  UserPlus,
  Save,
  Award,
  Heart,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const AdminUsers: React.FC = () => {
  const { registeredUsers, updateUserAccountStatus, verifyDonor, adminUpdateUser, registerUser, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Selected user for viewing details or editing
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState<BloodGroup>('O+');
  const [editLocation, setEditLocation] = useState('');
  const [editAccountStatus, setEditAccountStatus] = useState<AccountStatus>('active');
  const [editVerificationStatus, setEditVerificationStatus] = useState<VerificationStatus>('Verified');
  const [editRole, setEditRole] = useState<UserRole>('donor');
  const [editTotalDonations, setEditTotalDonations] = useState<number>(0);
  const [editEligibility, setEditEligibility] = useState<'Eligible' | 'Temporarily Ineligible' | 'Needs Review'>('Eligible');
  const [editLastDonation, setEditLastDonation] = useState('');

  // Add user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('donor');
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>('O+');
  const [newLocation, setNewLocation] = useState('Metro Central');
  const [newAccountStatus, setNewAccountStatus] = useState<AccountStatus>('active');

  // Filter users (exclude admin itself from user management table)
  const nonAdminUsers = registeredUsers.filter((u) => u.role !== 'admin');

  const filteredUsers = nonAdminUsers.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q) || false;
      const matchLocation = u.location?.toLowerCase().includes(q) || false;
      const matchBlood = u.bloodGroup?.toLowerCase().includes(q) || false;
      if (!matchName && !matchEmail && !matchPhone && !matchLocation && !matchBlood) {
        return false;
      }
    }
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All' && (u.accountStatus || 'active') !== statusFilter) return false;
    return true;
  });

  const pendingCount = nonAdminUsers.filter((u) => u.accountStatus === 'pending').length;
  const activeCount = nonAdminUsers.filter((u) => !u.accountStatus || u.accountStatus === 'active').length;
  const suspendedCount = nonAdminUsers.filter((u) => u.accountStatus === 'suspended' || u.accountStatus === 'rejected').length;
  const donorCount = nonAdminUsers.filter((u) => u.role === 'donor').length;

  const handleOpenEdit = (u: UserProfile) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');
    setEditBloodGroup(u.bloodGroup || 'O+');
    setEditLocation(u.location || u.address || '');
    setEditAccountStatus(u.accountStatus || 'active');
    setEditVerificationStatus(u.verificationStatus || 'Verified');
    setEditRole(u.role);
    setEditTotalDonations(u.totalDonations || 0);
    setEditEligibility(u.eligibilityStatus || 'Eligible');
    setEditLastDonation(u.lastDonationDate || '2026-05-18');
    setIsEditingUser(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    adminUpdateUser(selectedUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      bloodGroup: editBloodGroup,
      location: editLocation,
      accountStatus: editAccountStatus,
      verificationStatus: editVerificationStatus,
      role: editRole,
      totalDonations: Number(editTotalDonations),
      eligibilityStatus: editEligibility,
      lastDonationDate: editLastDonation,
    });

    setIsEditingUser(false);
    setSelectedUser(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created = registerUser({
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      bloodGroup: newBloodGroup,
      location: newLocation,
      verificationStatus: newAccountStatus === 'active' ? 'Verified' : 'Pending Verification',
    });

    // If admin explicitly created as active, ensure status is active
    if (newAccountStatus === 'active') {
      adminUpdateUser(created.id, {
        accountStatus: 'active',
        verificationStatus: 'Verified',
      });
    }

    addToast({
      type: 'success',
      title: 'New Account Created',
      message: `Registered ${newName} as an approved ${newRole}.`,
    });

    setIsAddUserModalOpen(false);
    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleStatusAction = (userId: string, newStatus: AccountStatus, extraVerification?: VerificationStatus) => {
    updateUserAccountStatus(userId, newStatus, extraVerification);
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, accountStatus: newStatus, verificationStatus: extraVerification || (newStatus === 'active' ? 'Verified' : prev.verificationStatus) } : null));
    }
  };

  const handleVerifyDonorAction = (donorId: string) => {
    verifyDonor(donorId);
    if (selectedUser && selectedUser.id === donorId) {
      setSelectedUser((prev) => (prev ? { ...prev, verificationStatus: 'Verified', accountStatus: 'active' } : null));
    }
  };

  const getStatusBadge = (status?: AccountStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="warning" size="sm" dot>
            Pending Approval
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="danger" size="sm" dot>
            Suspended
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" size="sm">
            Rejected
          </Badge>
        );
      case 'active':
      default:
        return (
          <Badge variant="success" size="sm" dot>
            Active
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blood-600" /> Donor & User Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Approve registered donors, edit medical & contact information, verify clinical clearance, and control system roles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Admin_Users_${getTodayDateString()}`,
                filteredUsers,
                [
                  { header: 'User ID', accessor: 'id' },
                  { header: 'Full Name', accessor: 'name' },
                  { header: 'Email Address', accessor: 'email' },
                  { header: 'Phone', accessor: (u) => u.phone || 'N/A' },
                  { header: 'Role', accessor: 'role' },
                  { header: 'Blood Group', accessor: (u) => u.bloodGroup || 'N/A' },
                  { header: 'Location / Zone', accessor: (u) => u.location || u.address || 'N/A' },
                  { header: 'Account Status', accessor: (u) => u.accountStatus || 'active' },
                  { header: 'Verification Status', accessor: (u) => u.verificationStatus || 'Unverified' },
                  { header: 'Registration Date', accessor: (u) => u.registeredAt || '2024-03-12' },
                ]
              );
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add New Donor / User
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card 
          onClick={() => { setRoleFilter('All'); setStatusFilter('All'); }}
          className="p-4 bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{nonAdminUsers.length}</h3>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card 
          onClick={() => { setRoleFilter('donor'); setStatusFilter('All'); }}
          className="p-4 bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 cursor-pointer hover:border-red-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Active Donors</p>
              <h3 className="text-2xl font-black text-red-900 dark:text-red-300 mt-1">{donorCount}</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl text-red-700 dark:text-red-300">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card 
          onClick={() => { setStatusFilter('pending'); setRoleFilter('All'); }}
          className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-black text-amber-900 dark:text-amber-300 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-700 dark:text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card 
          onClick={() => { setStatusFilter('active'); setRoleFilter('All'); }}
          className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Approved & Active</p>
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-300 mt-1">{activeCount}</h3>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Role Tabs for Fast Filtering */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm">
        {[
          { key: 'All', label: 'All Users', count: nonAdminUsers.length },
          { key: 'donor', label: '🩸 Donors Only', count: donorCount },
          { key: 'bloodbank', label: '🏥 Blood Banks', count: nonAdminUsers.filter((u) => u.role === 'bloodbank').length },
          { key: 'hospital', label: '🏨 Hospitals', count: nonAdminUsers.filter((u) => u.role === 'hospital').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRoleFilter(tab.key)}
            className={`pb-3 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              roleFilter === tab.key
                ? 'border-blood-600 text-blood-600 dark:text-blood-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                roleFilter === tab.key
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
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
              placeholder="Search by name, email, phone, location, blood group..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All User Roles</option>
              <option value="donor">Donors</option>
              <option value="bloodbank">Blood Banks</option>
              <option value="hospital">Hospitals</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Account Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Pending Approval Notice Banner with 1-Click Approve All */}
      {pendingCount > 0 && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span>{pendingCount} Applicant Account(s) Waiting for Admin Approval</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New donors, blood banks, or hospitals cannot enter their dashboard until approved.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const pendingUsers = nonAdminUsers.filter((u) => u.accountStatus === 'pending');
              pendingUsers.forEach((u) => {
                updateUserAccountStatus(u.id, 'active', 'Verified');
              });
              addToast({
                type: 'success',
                title: 'All Pending Accounts Approved',
                message: `Successfully approved and verified ${pendingUsers.length} user account(s).`,
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" /> ⚡ One-Click Approve All ({pendingCount})
          </button>
        </Card>
      )}

      {/* Users & Donors Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4 text-right">Admin Command Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const status = u.accountStatus || 'active';
                  const isDonor = u.role === 'donor';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isDonor 
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60'
                              : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300'
                          }`}>
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {isDonor && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300 font-semibold">
                                  Donor
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>{u.email}</span>
                              {u.phone && <span>• {u.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            u.role === 'donor'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : u.role === 'bloodbank'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.bloodGroup ? (
                          <Badge variant="blood" size="sm">
                            {u.bloodGroup}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">N/A</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.verificationStatus === 'Verified' ? (
                          <Badge variant="success" size="sm" dot>
                            Verified
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant="warning" size="sm" dot>
                              Pending
                            </Badge>
                            {isDonor && (
                              <button
                                onClick={() => handleVerifyDonorAction(u.id)}
                                title="Verify Donor Medical Clearance"
                                className="px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 transition-all shadow-xs"
                              >
                                ✓ Verify
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(status)}</td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {u.registeredAt || '2024-03-12'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Approve Action */}
                          {status === 'pending' && (
                            <button
                              onClick={() => handleStatusAction(u.id, 'active', 'Verified')}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {/* Quick Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900/60 transition-all flex items-center gap-1"
                            title="Edit and Command Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Info
                          </button>

                          {/* Suspend / Reactivate Action */}
                          {status === 'active' && (
                            <button
                              onClick={() => handleStatusAction(u.id, 'suspended')}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              Suspend
                            </button>
                          )}

                          {(status === 'suspended' || status === 'rejected') && (
                            <button
                              onClick={() => handleStatusAction(u.id, 'active')}
                              className="px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Reactivate
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsEditingUser(false);
                            }}
                            className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit & Command User/Donor Modal */}
      {isEditingUser && selectedUser && (
        <Modal
          isOpen={isEditingUser}
          onClose={() => setIsEditingUser(false)}
          title={`Edit & Command Info: ${selectedUser.name}`}
          subtitle={`Administrator live modification for ${selectedUser.role.toUpperCase()} record.`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Mobile Phone
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Approval Status
                </label>
                <select
                  value={editAccountStatus}
                  onChange={(e) => setEditAccountStatus(e.target.value as AccountStatus)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  <option value="active">Active (Approved)</option>
                  <option value="pending">Pending Administrator Approval</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medical & Verification Status
                </label>
                <select
                  value={editVerificationStatus}
                  onChange={(e) => setEditVerificationStatus(e.target.value as VerificationStatus)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  <option value="Verified">Verified & Clinically Cleared</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Flagged">Flagged for Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location Zone / Address
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role Tier
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  <option value="donor">Donor</option>
                  <option value="bloodbank">Blood Bank</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>

              {editRole === 'donor' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Total Completed Donations
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editTotalDonations}
                      onChange={(e) => setEditTotalDonations(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Donor Eligibility Status
                    </label>
                    <select
                      value={editEligibility}
                      onChange={(e) => setEditEligibility(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                    >
                      <option value="Eligible">Eligible for Immediate Donation</option>
                      <option value="Temporarily Ineligible">Temporarily Ineligible (Waiting Period)</option>
                      <option value="Needs Review">Needs Medical Review</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingUser(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all"
              >
                <Save className="w-4 h-4" /> Save Administrator Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New User/Donor Modal */}
      {isAddUserModalOpen && (
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          title="Register New Donor / User"
          subtitle="Directly provision an authenticated account with administrator clearance."
          maxWidth="md"
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Pierce"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jonathan@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 345-6789"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  <option value="donor">Donor</option>
                  <option value="bloodbank">Blood Bank</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={newAccountStatus}
                  onChange={(e) => setNewAccountStatus(e.target.value as AccountStatus)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blood-500 focus:outline-none"
                >
                  <option value="active">Active (Approved)</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Register & Provision Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* User Details Modal */}
      {selectedUser && !isEditingUser && (
        <Modal
          isOpen={!!selectedUser && !isEditingUser}
          onClose={() => setSelectedUser(null)}
          title={`User Record: ${selectedUser.name}`}
          subtitle={`Account ID: ${selectedUser.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-slate-900 dark:text-white break-all">{selectedUser.email}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Role Tier</span>
                <span className="font-bold uppercase text-slate-900 dark:text-white">{selectedUser.role}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                <span className="font-bold text-blood-600 dark:text-blood-400">{selectedUser.bloodGroup || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedUser.location || selectedUser.address || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Status</span>
                <div className="mt-1">{getStatusBadge(selectedUser.accountStatus)}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Registration & Verification</div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Registered On:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedUser.registeredAt || '2024-03-12'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Verification State:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedUser.verificationStatus === 'Verified' ? 'Verified' : 'Unverified'}</span>
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleOpenEdit(selectedUser)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Full Details
                </button>

                {selectedUser.accountStatus !== 'active' && (
                  <button
                    onClick={() => {
                      handleStatusAction(selectedUser.id, 'active', 'Verified');
                      setSelectedUser(null);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    Approve / Activate
                  </button>
                )}
                {selectedUser.accountStatus === 'active' && (
                  <button
                    onClick={() => {
                      handleStatusAction(selectedUser.id, 'suspended');
                      setSelectedUser(null);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl"
                  >
                    Suspend
                  </button>
                )}
                {selectedUser.role === 'donor' && selectedUser.verificationStatus !== 'Verified' && (
                  <button
                    onClick={() => {
                      handleVerifyDonorAction(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-xl"
                  >
                    Verify Donor
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
