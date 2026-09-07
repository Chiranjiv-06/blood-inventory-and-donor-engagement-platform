export type UserRole = 'donor' | 'bloodbank' | 'hospital' | 'admin';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'Whole Blood' | 'Red Blood Cells' | 'Platelets' | 'Fresh Frozen Plasma' | 'Cryoprecipitate';

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';

export type RequestStatus = 'Pending' | 'Matched' | 'Accepted' | 'Allocated' | 'In Transit' | 'Fulfilled' | 'Cancelled';

export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export type VerificationStatus = 'Verified' | 'Pending Verification' | 'Suspended' | 'Flagged';

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  location: string;
  address?: string;
  bloodGroup?: BloodGroup;
  dob?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  totalDonations?: number;
  lastDonationDate?: string;
  eligibilityStatus?: 'Eligible' | 'Temporarily Ineligible' | 'Needs Review';
  eligibilityReason?: string;
  nextEligibleDate?: string;
  organizationName?: string;
  licenseNumber?: string;
  verificationStatus?: VerificationStatus;
  accountStatus: AccountStatus;
  registeredAt?: string;
}

export interface BloodInventoryItem {
  id: string;
  unitCode: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  quantityUnits: number;
  volumeMl: number;
  collectionDate: string;
  expiryDate: string;
  testingStatus: 'Tested & Cleared' | 'Pending Serology' | 'Quarantine';
  availability: 'Available' | 'Reserved' | 'Dispatched' | 'Expired';
  locationStorage: string;
  isLowStock?: boolean;
  isNearExpiry?: boolean;
}

export interface DonorAppointment {
  id: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodBankAddress: string;
  date: string;
  timeSlot: string;
  donationType: BloodComponent;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string;
  bloodBankName: string;
  bloodBankLocation: string;
  bloodGroup: BloodGroup;
  donationType: BloodComponent;
  units: number;
  status: 'Completed' | 'Tested & Cleared' | 'Processed';
  certificateId: string;
  impactLivesSaved: number;
}

export interface EmergencyAlert {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  distanceKm: number;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsRequired: number;
  urgency: UrgencyLevel;
  requiredBy: string;
  timeRemainingMinutes: number;
  reason: string;
  status: 'Open' | 'Accepted' | 'Declined' | 'Fulfilled';
  contactPerson: string;
  contactPhone: string;
  createdAt: string;
}

export interface BloodBankFacility {
  id: string;
  name: string;
  type: 'Red Cross' | 'Government Hospital' | 'Private Blood Center' | 'Community Trust';
  address: string;
  city: string;
  distanceKm: number;
  openingHours: string;
  phone: string;
  email: string;
  rating: number;
  availableStock: Record<BloodGroup, number>;
  coordinates: { lat: number; lng: number };
  emergencyService: boolean;
  verified: boolean;
}

export interface HospitalBloodRequest {
  id: string;
  requestId: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLocation: string;
  patientRefId: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  quantityUnits: number;
  urgency: UrgencyLevel;
  requiredBy: string;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  matchedBloodBanks?: {
    bloodBankId: string;
    bloodBankName: string;
    availableUnits: number;
    distanceKm: number;
    matchStatus: 'High Match' | 'Direct Available' | 'Partial Stock';
    estimatedArrivalMinutes: number;
    phone: string;
  }[];
  allocatedBloodBankId?: string;
  allocatedBloodBankName?: string;
}

export interface StockTransfer {
  id: string;
  transferId: string;
  fromBank: string;
  toBank: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  quantityUnits: number;
  dispatchDate: string;
  status: 'In Transit' | 'Received' | 'Scheduled';
  courierName: string;
  trackingTempCelsius: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'appointment' | 'system' | 'inventory' | 'verification';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'Inventory' | 'Request' | 'Appointment' | 'User' | 'Organization' | 'System';
  entityId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  status: 'Success' | 'Warning' | 'Failed';
}

export interface FraudAlertItem {
  id: string;
  type: 'Duplicate Account' | 'Frequent Emergency Request' | 'Suspicious Batch ID' | 'Unverified Medical License';
  entityName: string;
  role: UserRole;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  detectedAt: string;
  status: 'Open Review' | 'Investigating' | 'Resolved' | 'Banned';
}
