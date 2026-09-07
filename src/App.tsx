import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { AccountPendingPage } from './pages/public/AccountPendingPage';
import { AccountStatusPage } from './pages/public/AccountStatusPage';

// Protection & Common Dashboard Shell
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/common/DashboardLayout';

// Donor Pages
import { DonorOverview } from './pages/donor/DonorOverview';
import { DonorProfile } from './pages/donor/DonorProfile';
import { EligibilityCheck } from './pages/donor/EligibilityCheck';
import { BookDonation } from './pages/donor/BookDonation';
import { MyAppointments } from './pages/donor/MyAppointments';
import { DonationHistory } from './pages/donor/DonationHistory';
import { EmergencyAlerts } from './pages/donor/EmergencyAlerts';
import { NearbyBloodBanks } from './pages/donor/NearbyBloodBanks';
import { DonorNotifications } from './pages/donor/DonorNotifications';
import { DonorSettings } from './pages/donor/DonorSettings';

// Blood Bank Pages
import { BloodBankOverview } from './pages/bloodbank/BloodBankOverview';
import { InventoryManagement } from './pages/bloodbank/InventoryManagement';
import { DonorDirectory } from './pages/bloodbank/DonorDirectory';
import { BloodBankAppointments } from './pages/bloodbank/BloodBankAppointments';
import { BloodBankEmergencyRequests } from './pages/bloodbank/BloodBankEmergencyRequests';
import { BloodTransfers } from './pages/bloodbank/BloodTransfers';
import { BloodBankReports } from './pages/bloodbank/BloodBankReports';

// Hospital Pages
import { HospitalOverview } from './pages/hospital/HospitalOverview';
import { CreateBloodRequest } from './pages/hospital/CreateBloodRequest';
import { HospitalMyRequests } from './pages/hospital/HospitalMyRequests';
import { MatchedBloodBanks } from './pages/hospital/MatchedBloodBanks';
import { HospitalEmergencyRequests } from './pages/hospital/HospitalEmergencyRequests';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminOrganizations } from './pages/admin/AdminOrganizations';
import { AdminBloodInventory } from './pages/admin/AdminBloodInventory';
import { AdminEmergencyRequests } from './pages/admin/AdminEmergencyRequests';
import { AdminVerificationFraud } from './pages/admin/AdminVerificationFraud';
import { AdminAuditLogsReports } from './pages/admin/AdminAuditLogsReports';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/account-pending" element={<AccountPendingPage />} />
      <Route path="/account-status" element={<AccountStatusPage />} />

      {/* Donor Portal (Protected) */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DonorOverview />} />
        <Route path="profile" element={<DonorProfile />} />
        <Route path="eligibility" element={<EligibilityCheck />} />
        <Route path="book" element={<BookDonation />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="history" element={<DonationHistory />} />
        <Route path="emergency-alerts" element={<EmergencyAlerts />} />
        <Route path="nearby" element={<NearbyBloodBanks />} />
        <Route path="notifications" element={<DonorNotifications />} />
        <Route path="settings" element={<DonorSettings />} />
      </Route>

      {/* Blood Bank Portal (Protected) */}
      <Route
        path="/bloodbank"
        element={
          <ProtectedRoute allowedRoles={['bloodbank']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BloodBankOverview />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="donors" element={<DonorDirectory />} />
        <Route path="appointments" element={<BloodBankAppointments />} />
        <Route path="emergency-requests" element={<BloodBankEmergencyRequests />} />
        <Route path="transfers" element={<BloodTransfers />} />
        <Route path="reports" element={<BloodBankReports />} />
        <Route path="notifications" element={<DonorNotifications />} />
        <Route path="settings" element={<DonorSettings />} />
      </Route>

      {/* Hospital Portal (Protected) */}
      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HospitalOverview />} />
        <Route path="create-request" element={<CreateBloodRequest />} />
        <Route path="requests" element={<HospitalMyRequests />} />
        <Route path="matched-banks" element={<MatchedBloodBanks />} />
        <Route path="emergency" element={<HospitalEmergencyRequests />} />
        <Route path="notifications" element={<DonorNotifications />} />
        <Route path="settings" element={<DonorSettings />} />
      </Route>

      {/* Admin Portal (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="organizations" element={<AdminOrganizations />} />
        <Route path="inventory" element={<AdminBloodInventory />} />
        <Route path="emergency" element={<AdminEmergencyRequests />} />
        <Route path="verification" element={<AdminVerificationFraud />} />
        <Route path="fraud-flags" element={<AdminVerificationFraud />} />
        <Route path="audit-logs" element={<AdminAuditLogsReports />} />
        <Route path="reports" element={<AdminAuditLogsReports />} />
        <Route path="settings" element={<DonorSettings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
