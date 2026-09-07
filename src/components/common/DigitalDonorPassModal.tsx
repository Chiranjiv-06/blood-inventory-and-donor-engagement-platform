import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Badge } from './Badge';
import {
  CreditCard,
  Download,
  ShieldCheck,
  QrCode,
  Droplets,
  Heart,
  Award,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface DigitalDonorPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalDonorPassModal: React.FC<DigitalDonorPassModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addToast } = useApp();
  const passRef = useRef<HTMLDivElement>(null);

  const donorName = currentUser.name || 'Valued Donor';
  const bloodGroup = currentUser.bloodGroup || 'O+';
  const donorId = currentUser.id || 'BL-DONOR-8841';
  const totalDonations = currentUser.totalDonations ?? 8;
  const receivingHouse = 'Metropolitan Red Cross Central Blood Bank';
  const issueDate = new Date().toISOString().split('T')[0];
  const expiryDate = '2028-12-31';

  const downloadPassPDF = () => {
    // Generate a high-resolution credit-card/wallet-sized digital pass PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [140, 88], // Standard wallet card pass dimensions
    });

    const width = 140;
    const height = 88;

    // Gradient-like dark medical pass background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(4, 4, width - 8, height - 8, 4, 4, 'F');

    // Top Header Banner
    doc.setFillColor(220, 38, 38); // blood red #dc2626
    doc.roundedRect(4, 4, width - 8, 16, 4, 4, 'F');
    doc.rect(4, 16, width - 8, 4, 'F'); // square bottom of header

    // Brand Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('BLOODLINK HEALTHCARE NETWORK', 12, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(254, 202, 202);
    doc.text('OFFICIAL VERIFIED DIGITAL DONOR E-PASS', 12, 16);

    // Blood Group Badge (Top Right)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(width - 26, 7, 18, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(bloodGroup, width - 17, 13.5, { align: 'center' });

    // Donor Avatar/Initials Box
    doc.setFillColor(30, 41, 59);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.8);
    doc.roundedRect(12, 24, 22, 22, 3, 3, 'FD');

    const initials = donorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(initials, 23, 37, { align: 'center' });

    // Donor Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    // Wrap name if too long
    const nameLines = doc.splitTextToSize(donorName.toUpperCase(), 50);
    doc.text(nameLines, 38, 29);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`DONOR ID: ${donorId}`, 38, 35);
    doc.text(`STATUS: ACTIVE & CLINICALLY VERIFIED`, 38, 39);
    doc.text(`LIFESAVER TIER: GOLD (${totalDonations} DONATIONS)`, 38, 43);

    // QR & Barcode Section Box (Right Side)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(width - 38, 24, 26, 26, 2, 2, 'F');

    // QR Simulation Grid
    doc.setFillColor(15, 23, 42);
    // Outer QR marks
    doc.rect(width - 35, 27, 6, 6, 'F');
    doc.rect(width - 20, 27, 6, 6, 'F');
    doc.rect(width - 35, 41, 6, 6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(width - 33.5, 28.5, 3, 3, 'F');
    doc.rect(width - 18.5, 28.5, 3, 3, 'F');
    doc.rect(width - 33.5, 42.5, 3, 3, 'F');
    doc.setFillColor(15, 23, 42);
    doc.rect(width - 32.5, 29.5, 1, 1, 'F');
    doc.rect(width - 17.5, 29.5, 1, 1, 'F');
    doc.rect(width - 32.5, 43.5, 1, 1, 'F');
    // Mini code dots
    doc.rect(width - 26, 28, 2, 2, 'F');
    doc.rect(width - 24, 33, 3, 2, 'F');
    doc.rect(width - 20, 37, 4, 2, 'F');
    doc.rect(width - 27, 40, 2, 3, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(100, 116, 139);
    doc.text('SCAN TO VERIFY', width - 25, 52, { align: 'center' });

    // Details Grid (Bottom Half)
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(10, 55, width - 20, 24, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('RECEIVING HOUSE / REGISTRY:', 14, 61);
    doc.text('EMERGENCY CONTACT:', 82, 61);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    const recLines = doc.splitTextToSize(receivingHouse, 62);
    doc.text(recLines, 14, 66);

    const contactName = currentUser.emergencyContact?.name || 'Sarah Mitchell';
    const contactPhone = currentUser.emergencyContact?.phone || '+1 (555) 987-6543';
    doc.text(`${contactName} (${contactPhone})`, 82, 66);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(`ISSUED: ${issueDate}  |  VALID UNTIL: ${expiryDate}`, 14, 75);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text('FAST-TRACK TRANSFUSION ACCESS ENABLED', 82, 75);

    const filename = `BloodLink_Digital_Donor_Pass_${donorId}.pdf`;
    doc.save(filename);

    addToast({
      type: 'success',
      title: 'Digital Pass Downloaded',
      message: `${filename} saved successfully.`,
    });
  };

  const copyDonorId = () => {
    navigator.clipboard.writeText(donorId);
    addToast({
      type: 'info',
      title: 'Donor ID Copied',
      message: `${donorId} copied to clipboard.`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Digital Donor E-Pass"
      subtitle="Your verified universal identification pass for seamless check-in across all certified blood banks and hospitals."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Interactive E-Pass Card Preview */}
        <div
          ref={passRef}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-6 sm:p-7 text-white shadow-2xl border-2 border-red-500/40"
        >
          {/* Decorative glow circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
                  BloodLink Healthcare Network
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
                  DIGITAL DONOR E-PASS
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white text-red-600 font-black text-sm shadow-md flex items-center gap-1">
                <Droplets className="w-4 h-4 fill-red-600" />
                <span>{bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Middle Body */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Donor Identity */}
            <div className="sm:col-span-8 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0 border-2 border-white/20">
                {donorName
                  ? donorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'BL'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-white truncate">{donorName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-md border border-red-800/60">
                    ID: {donorId}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Donor
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gold Tier Life-Saver &bull; {totalDonations} Donations</span>
                </div>
              </div>
            </div>

            {/* QR Code Verification Simulation */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-slate-900 shadow-lg">
              <div className="p-1 bg-white rounded-lg">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1 uppercase tracking-wider">
                Scan for Fast-Track
              </span>
            </div>
          </div>

          {/* Bottom Details Box */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-red-400" /> Receiving House / Facility
              </span>
              <p className="font-bold text-white mt-0.5 truncate text-xs" title={receivingHouse}>
                {receivingHouse}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" /> Emergency Contact
              </span>
              <p className="font-bold text-white mt-0.5 truncate text-xs">
                {currentUser.emergencyContact?.name || 'Sarah Mitchell'} ({currentUser.emergencyContact?.phone || '+1 (555) 987-6543'})
              </p>
            </div>
          </div>

          {/* Hologram / Security Footer */}
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Issued: {issueDate} &bull; Valid: {expiryDate}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Anti-Counterfeit Secured
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={copyDonorId}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy Donor ID
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPassPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md shadow-red-500/20 transition-all"
            >
              <Download className="w-4 h-4" /> Download Digital Pass (PDF)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
