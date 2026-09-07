import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  AccountStatus,
  VerificationStatus,
  BloodInventoryItem,
  DonorAppointment,
  DonationRecord,
  EmergencyAlert,
  HospitalBloodRequest,
  NotificationItem,
  AuditLogItem,
  FraudAlertItem,
  BloodBankFacility,
} from '../types';
import {
  mockUsers,
  initialRegisteredUsers,
  mockInventory,
  mockAppointments,
  mockDonationHistory,
  mockEmergencyAlerts,
  mockHospitalRequests,
  mockNotifications,
  mockAuditLogs,
  mockFraudAlerts,
  mockDonorsDirectory,
  mockOrganizations,
  mockBloodBanks,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  currentRole: UserRole;
  currentUser: UserProfile;
  registeredUsers: UserProfile[];
  loginUser: (emailOrPhone: string, password: string, portalType: 'user' | 'admin') => { success: boolean; message?: string; user?: UserProfile };
  registerUser: (userData: Omit<UserProfile, 'id' | 'accountStatus' | 'registeredAt'> & { password?: string }) => UserProfile;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateCurrentUser: (data: Partial<UserProfile>) => void;
  updateUserAccountStatus: (userId: string, status: AccountStatus, verificationStatus?: VerificationStatus) => void;
  verifyDonor: (donorId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<UserProfile>) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Data State
  inventory: BloodInventoryItem[];
  addInventoryItem: (item: Omit<BloodInventoryItem, 'id' | 'unitCode'>) => void;
  updateInventoryItem: (id: string, item: Partial<BloodInventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  appointments: DonorAppointment[];
  bookAppointment: (apt: Omit<DonorAppointment, 'id' | 'createdAt'>) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  updateAppointmentStatus: (id: string, status: DonorAppointment['status']) => void;

  donationHistory: DonationRecord[];
  
  emergencyAlerts: EmergencyAlert[];
  respondToEmergencyAlert: (id: string, response: 'Accepted' | 'Declined') => void;
  createEmergencyAlert: (alert: Omit<EmergencyAlert, 'id' | 'createdAt' | 'timeRemainingMinutes' | 'status'>) => void;

  hospitalRequests: HospitalBloodRequest[];
  createHospitalRequest: (req: Omit<HospitalBloodRequest, 'id' | 'requestId' | 'status' | 'createdAt'>) => void;
  cancelHospitalRequest: (id: string) => void;
  allocateHospitalRequest: (id: string, bloodBankId: string, bloodBankName: string) => void;
  fulfillHospitalRequest: (id: string) => void;

  bloodBanks: BloodBankFacility[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  donorsDirectory: typeof mockDonorsDirectory;
  organizations: typeof mockOrganizations;
  updateOrgStatus: (id: string, status: 'Active' | 'Pending Verification' | 'Suspended') => void;

  fraudAlerts: FraudAlertItem[];
  updateFraudStatus: (id: string, status: FraudAlertItem['status']) => void;

  auditLogs: AuditLogItem[];
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered Users Directory state
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('bloodlink_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialRegisteredUsers;
      }
    }
    return initialRegisteredUsers;
  });

  // Authentication State
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bloodlink_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('bloodlink_role') as UserRole) || 'donor';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const isAuth = localStorage.getItem('bloodlink_auth') === 'true';
    if (!isAuth) return null;
    const saved = localStorage.getItem('bloodlink_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockUsers.donor;
      }
    }
    const role = (localStorage.getItem('bloodlink_role') as UserRole) || 'donor';
    return mockUsers[role] || mockUsers.donor;
  });

  // Restore and sync session state on initial application startup
  useEffect(() => {
    const isAuth = localStorage.getItem('bloodlink_auth') === 'true';
    if (isAuth) {
      const savedUserStr = localStorage.getItem('bloodlink_current_user');
      let restoredUser: UserProfile | null = null;
      if (savedUserStr) {
        try {
          restoredUser = JSON.parse(savedUserStr);
        } catch (e) {
          // ignore parse error
        }
      }

      if (restoredUser) {
        // Sync with freshest accountStatus and verificationStatus in registeredUsers if present
        const matched = registeredUsers.find((u) => u.id === restoredUser?.id || u.email === restoredUser?.email);
        if (matched) {
          restoredUser = { ...restoredUser, ...matched };
          localStorage.setItem('bloodlink_current_user', JSON.stringify(restoredUser));
        }
        setCurrentUser(restoredUser);
        setCurrentRole(restoredUser.role);
        setIsAuthenticated(true);
      }
    }
    setIsAuthInitialized(true);
  }, [registeredUsers]);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('bloodlink_theme') === 'dark';
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Domain Collections
  const [inventory, setInventory] = useState<BloodInventoryItem[]>(() => {
    const saved = localStorage.getItem('bloodlink_inventory');
    return saved ? JSON.parse(saved) : mockInventory;
  });

  const [appointments, setAppointments] = useState<DonorAppointment[]>(() => {
    const saved = localStorage.getItem('bloodlink_appointments');
    return saved ? JSON.parse(saved) : mockAppointments;
  });

  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('bloodlink_donations');
    return saved ? JSON.parse(saved) : mockDonationHistory;
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() => {
    const saved = localStorage.getItem('bloodlink_emergency');
    return saved ? JSON.parse(saved) : mockEmergencyAlerts;
  });

  const [hospitalRequests, setHospitalRequests] = useState<HospitalBloodRequest[]>(() => {
    const saved = localStorage.getItem('bloodlink_hospital_requests');
    return saved ? JSON.parse(saved) : mockHospitalRequests;
  });

  const [bloodBanks] = useState<BloodBankFacility[]>(mockBloodBanks);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bloodlink_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [donorsDirectory, setDonorsDirectory] = useState(mockDonorsDirectory);
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlertItem[]>(mockFraudAlerts);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);

  // Sync Theme to HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bloodlink_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bloodlink_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Functions
  const loginUser = (emailOrPhone: string, password: string, portalType: 'user' | 'admin') => {
    const normalizedInput = emailOrPhone.trim().toLowerCase();

    // Check if trying to log in as admin
    if (portalType === 'user') {
      if (normalizedInput === 'admin.supervision@bloodlink.gov' || normalizedInput.includes('admin')) {
        return {
          success: false,
          message: 'Admin accounts must log in via the dedicated Admin Login portal.',
        };
      }
    }

    if (portalType === 'admin') {
      if (normalizedInput !== 'admin.supervision@bloodlink.gov' && !normalizedInput.includes('admin')) {
        return {
          success: false,
          message: 'Access restricted. Non-admin users (Donors, Blood Banks, Hospitals) must log in via the User Login portal.',
        };
      }
    }

    // Lookup user in registered list or fallback mock users
    let foundUser: UserProfile | undefined = registeredUsers.find(
      (u) => u.email.toLowerCase() === normalizedInput || u.phone.replace(/[^0-9]/g, '').includes(normalizedInput.replace(/[^0-9]/g, ''))
    );

    if (!foundUser) {
      // Check mockUsers
      const matchedMock = Object.values(mockUsers).find(
        (u) => u.email.toLowerCase() === normalizedInput
      );
      if (matchedMock) foundUser = matchedMock;
    }

    // Default fallback for quick testing
    if (!foundUser) {
      if (portalType === 'admin') {
        foundUser = mockUsers.admin;
      } else {
        // Create matching test donor
        foundUser = {
          id: 'usr_' + Date.now(),
          name: emailOrPhone.split('@')[0] || 'Registered User',
          email: emailOrPhone,
          phone: '+1 (555) 000-0000',
          role: 'donor',
          location: 'Metro Central',
          bloodGroup: 'O+',
          accountStatus: 'active',
          verificationStatus: 'Verified',
          registeredAt: new Date().toISOString().slice(0, 10),
        };
      }
    }

    // Check portal mismatch
    if (portalType === 'admin' && foundUser.role !== 'admin') {
      return {
        success: false,
        message: 'Access restricted. This account does not have Super Administrator privileges.',
      };
    }

    if (portalType === 'user' && foundUser.role === 'admin') {
      return {
        success: false,
        message: 'Admin accounts must log in via the dedicated Admin Login portal.',
      };
    }

    // Authenticate
    setIsAuthenticated(true);
    setCurrentUser(foundUser);
    setCurrentRole(foundUser.role);
    localStorage.setItem('bloodlink_auth', 'true');
    localStorage.setItem('bloodlink_role', foundUser.role);
    localStorage.setItem('bloodlink_current_user', JSON.stringify(foundUser));

    addToast({
      type: 'success',
      title: `Signed In as ${foundUser.role.toUpperCase()}`,
      message: `Welcome back, ${foundUser.name}!`,
    });

    return {
      success: true,
      user: foundUser,
    };
  };

  const registerUser = (userData: Omit<UserProfile, 'id' | 'accountStatus' | 'registeredAt'> & { password?: string }) => {
    const newUser: UserProfile = {
      ...userData,
      id: 'usr_' + Date.now(),
      accountStatus: 'pending', // Default pending per requirement
      verificationStatus: 'Pending Verification',
      registeredAt: new Date().toISOString().slice(0, 10),
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    localStorage.setItem('bloodlink_registered_users', JSON.stringify(updated));

    // Save current user as authenticated but in pending state
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    localStorage.setItem('bloodlink_auth', 'true');
    localStorage.setItem('bloodlink_role', newUser.role);
    localStorage.setItem('bloodlink_current_user', JSON.stringify(newUser));

    // Also add to audit logs
    addAuditLog({
      userId: newUser.id,
      userName: newUser.name,
      userRole: newUser.role,
      action: 'USER_REGISTRATION',
      entityType: 'User',
      entityId: newUser.id,
      ipAddress: '127.0.0.1',
      details: `New ${newUser.role} registered with pending status.`,
      status: 'Success',
    });

    addToast({
      type: 'warning',
      title: 'Registration Submitted',
      message: 'Your account has been registered and is pending administrator approval.',
    });

    return newUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('bloodlink_auth');
    localStorage.removeItem('bloodlink_role');
    localStorage.removeItem('bloodlink_current_user');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely logged out of BloodLink.',
    });
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('bloodlink_role', role);
    const saved = localStorage.getItem(`bloodlink_user_${role}`);
    const userToSet = saved ? JSON.parse(saved) : mockUsers[role];
    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    localStorage.setItem('bloodlink_auth', 'true');
    localStorage.setItem('bloodlink_current_user', JSON.stringify(userToSet));
  };

  const updateCurrentUser = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('bloodlink_current_user', JSON.stringify(updated));
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    );
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile changes have been successfully saved.',
    });
  };

  const updateUserAccountStatus = (userId: string, status: AccountStatus, verificationStatus?: VerificationStatus) => {
    const updated = registeredUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          accountStatus: status,
          verificationStatus: verificationStatus || (status === 'active' ? 'Verified' : u.verificationStatus),
        };
      }
      return u;
    });

    setRegisteredUsers(updated);
    localStorage.setItem('bloodlink_registered_users', JSON.stringify(updated));

    if (currentUser && currentUser.id === userId) {
      const updatedCurr = {
        ...currentUser,
        accountStatus: status,
        verificationStatus: verificationStatus || (status === 'active' ? 'Verified' : currentUser.verificationStatus),
      };
      setCurrentUser(updatedCurr);
      localStorage.setItem('bloodlink_current_user', JSON.stringify(updatedCurr));
    }

    addToast({
      type: status === 'active' ? 'success' : status === 'rejected' ? 'error' : 'warning',
      title: `Account Marked as ${status.toUpperCase()}`,
      message: `User status changed to ${status}.`,
    });
  };

  const verifyDonor = (donorId: string) => {
    updateUserAccountStatus(donorId, 'active', 'Verified');
    addToast({
      type: 'success',
      title: 'Donor Verified & Approved',
      message: 'Donor credentials approved and cleared for donation.',
    });
  };

  const adminUpdateUser = (userId: string, data: Partial<UserProfile>) => {
    const updated = registeredUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, ...data };
      }
      return u;
    });

    setRegisteredUsers(updated);
    localStorage.setItem('bloodlink_registered_users', JSON.stringify(updated));

    if (currentUser && (currentUser.id === userId || currentUser.email === data.email)) {
      const updatedCurr = { ...currentUser, ...data };
      setCurrentUser(updatedCurr);
      localStorage.setItem('bloodlink_current_user', JSON.stringify(updatedCurr));
    }

    addToast({
      type: 'success',
      title: 'Donor / User Info Updated',
      message: `Administrator changes for ${data.name || 'user'} saved successfully.`,
    });
  };

  // Inventory actions
  const addInventoryItem = (item: Omit<BloodInventoryItem, 'id' | 'unitCode'>) => {
    const newItem: BloodInventoryItem = {
      ...item,
      id: 'inv_' + Date.now(),
      unitCode: `BL-${item.bloodGroup.replace('+', 'P').replace('-', 'N')}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random()*900)}`,
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    localStorage.setItem('bloodlink_inventory', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Inventory Unit Registered',
      message: `Added ${newItem.quantityUnits} unit(s) of ${newItem.bloodGroup} (${newItem.component}) to storage.`,
    });
  };

  const updateInventoryItem = (id: string, updates: Partial<BloodInventoryItem>) => {
    const updated = inventory.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setInventory(updated);
    localStorage.setItem('bloodlink_inventory', JSON.stringify(updated));
    addToast({
      type: 'info',
      title: 'Inventory Updated',
      message: 'Blood unit records updated.',
    });
  };

  const deleteInventoryItem = (id: string) => {
    const updated = inventory.filter((item) => item.id !== id);
    setInventory(updated);
    localStorage.setItem('bloodlink_inventory', JSON.stringify(updated));
    addToast({
      type: 'warning',
      title: 'Inventory Discarded',
      message: 'Blood unit record removed from system.',
    });
  };

  // Appointments actions
  const bookAppointment = (apt: Omit<DonorAppointment, 'id' | 'createdAt'>) => {
    const newApt: DonorAppointment = {
      ...apt,
      id: 'apt_' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    localStorage.setItem('bloodlink_appointments', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Donation Appointment Booked!',
      message: `Confirmed for ${newApt.date} at ${newApt.bloodBankName}.`,
    });
  };

  const cancelAppointment = (id: string, reason?: string) => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: 'Cancelled' as const, notes: reason || 'Cancelled by user' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('bloodlink_appointments', JSON.stringify(updated));
    addToast({
      type: 'warning',
      title: 'Appointment Cancelled',
      message: 'Your donation appointment has been cancelled.',
    });
  };

  const updateAppointmentStatus = (id: string, status: DonorAppointment['status']) => {
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt));
    setAppointments(updated);
    localStorage.setItem('bloodlink_appointments', JSON.stringify(updated));
    addToast({
      type: 'info',
      title: 'Appointment Status Changed',
      message: `Appointment marked as ${status}.`,
    });
  };

  // Emergency Alerts
  const respondToEmergencyAlert = (id: string, response: 'Accepted' | 'Declined') => {
    const updated = emergencyAlerts.map((alert) =>
      alert.id === id ? { ...alert, status: response } : alert
    );
    setEmergencyAlerts(updated);
    localStorage.setItem('bloodlink_emergency', JSON.stringify(updated));
    if (response === 'Accepted') {
      addToast({
        type: 'success',
        title: 'Thank You, Hero!',
        message: 'Your response was dispatched to the trauma center. Fast-track passage token prepared.',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Alert Dismissed',
        message: 'Response recorded. We will contact other matching donors.',
      });
    }
  };

  const createEmergencyAlert = (alert: Omit<EmergencyAlert, 'id' | 'createdAt' | 'timeRemainingMinutes' | 'status'>) => {
    const newAlert: EmergencyAlert = {
      ...alert,
      id: 'emg_' + Date.now(),
      timeRemainingMinutes: 60,
      status: 'Open',
      createdAt: 'Just now',
    };
    const updated = [newAlert, ...emergencyAlerts];
    setEmergencyAlerts(updated);
    localStorage.setItem('bloodlink_emergency', JSON.stringify(updated));
    addToast({
      type: 'error',
      title: '🚨 CRITICAL EMERGENCY BROADCASTED',
      message: `Sent high-priority alert for ${newAlert.unitsRequired} units of ${newAlert.bloodGroup} to nearby donors.`,
    });
  };

  // Hospital Requests
  const createHospitalRequest = (req: Omit<HospitalBloodRequest, 'id' | 'requestId' | 'status' | 'createdAt'>) => {
    const requestId = `REQ-HOSP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;
    const newReq: HospitalBloodRequest = {
      ...req,
      id: 'req_' + Date.now(),
      requestId,
      status: req.urgency === 'Critical' ? 'Matched' : 'Pending',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      matchedBloodBanks: [
        {
          bloodBankId: 'bb_1',
          bloodBankName: 'Metropolitan Red Cross Blood Hub',
          availableUnits: 4,
          distanceKm: 2.4,
          matchStatus: 'Direct Available',
          estimatedArrivalMinutes: 20,
          phone: '+1 (555) 300-8800',
        },
        {
          bloodBankId: 'bb_2',
          bloodBankName: 'Saint Jude Regional Transfusion Center',
          availableUnits: 2,
          distanceKm: 4.8,
          matchStatus: 'Partial Stock',
          estimatedArrivalMinutes: 35,
          phone: '+1 (555) 440-1212',
        }
      ],
    };
    const updated = [newReq, ...hospitalRequests];
    setHospitalRequests(updated);
    localStorage.setItem('bloodlink_hospital_requests', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Blood Request Dispatched',
      message: `Request ${requestId} submitted with urgency: ${req.urgency}.`,
    });
  };

  const cancelHospitalRequest = (id: string) => {
    const updated = hospitalRequests.map((r) => (r.id === id ? { ...r, status: 'Cancelled' as const } : r));
    setHospitalRequests(updated);
    localStorage.setItem('bloodlink_hospital_requests', JSON.stringify(updated));
    addToast({
      type: 'warning',
      title: 'Request Cancelled',
      message: 'Blood request withdrawn from matching network.',
    });
  };

  const allocateHospitalRequest = (id: string, bloodBankId: string, bloodBankName: string) => {
    const updated = hospitalRequests.map((r) =>
      r.id === id ? { ...r, status: 'Allocated' as const, allocatedBloodBankId: bloodBankId, allocatedBloodBankName: bloodBankName } : r
    );
    setHospitalRequests(updated);
    localStorage.setItem('bloodlink_hospital_requests', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Units Allocated & Reserved',
      message: `Matched units confirmed with ${bloodBankName}. Logistics in progress.`,
    });
  };

  const fulfillHospitalRequest = (id: string) => {
    const updated = hospitalRequests.map((r) => (r.id === id ? { ...r, status: 'Fulfilled' as const } : r));
    setHospitalRequests(updated);
    localStorage.setItem('bloodlink_hospital_requests', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Request Fulfilled',
      message: 'Blood units received and transfused successfully.',
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('bloodlink_notifications', JSON.stringify(updated));
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('bloodlink_notifications', JSON.stringify(updated));
    addToast({ type: 'info', title: 'All Notifications Marked Read' });
  };

  // Admin & Org
  const updateOrgStatus = (id: string, status: 'Active' | 'Pending Verification' | 'Suspended') => {
    const updated = organizations.map((org) => (org.id === id ? { ...org, status } : org));
    setOrganizations(updated);
    addToast({
      type: 'info',
      title: 'Organization Status Updated',
      message: `Status updated to ${status}.`,
    });
  };

  const updateFraudStatus = (id: string, status: FraudAlertItem['status']) => {
    const updated = fraudAlerts.map((f) => (f.id === id ? { ...f, status } : f));
    setFraudAlerts(updated);
    addToast({
      type: 'warning',
      title: 'Security Flag Updated',
      message: `Case marked as ${status}.`,
    });
  };

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const newLog: AuditLogItem = {
      ...log,
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthInitialized,
        currentRole,
        currentUser: currentUser || mockUsers.donor,
        registeredUsers,
        loginUser,
        registerUser,
        logout,
        setRole,
        updateCurrentUser,
        updateUserAccountStatus,
        verifyDonor,
        adminUpdateUser,
        isDarkMode,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        appointments,
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        donationHistory,
        emergencyAlerts,
        respondToEmergencyAlert,
        createEmergencyAlert,
        hospitalRequests,
        createHospitalRequest,
        cancelHospitalRequest,
        allocateHospitalRequest,
        fulfillHospitalRequest,
        bloodBanks,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        donorsDirectory,
        organizations,
        updateOrgStatus,
        fraudAlerts,
        updateFraudStatus,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
