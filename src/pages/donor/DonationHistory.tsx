import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DigitalDonorPassModal } from '../../components/common/DigitalDonorPassModal';
import {
  Award,
  Heart,
  Droplets,
  Download,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Share2,
  ShieldCheck,
  FileSpreadsheet,
  CreditCard,
} from 'lucide-react';
import { DonationRecord } from '../../types';
import jsPDF from 'jspdf';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const DonationHistory: React.FC = () => {
  const { donationHistory, currentUser, addToast } = useApp();
  const [selectedCert, setSelectedCert] = useState<DonationRecord | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const totalUnits = donationHistory.reduce((acc, curr) => acc + curr.units, 0);
  const totalLivesSaved = donationHistory.reduce((acc, curr) => acc + curr.impactLivesSaved, 0);

  const generateAndDownloadPDF = (record: DonationRecord) => {
    const certId = record.certificateId || record.id;
    // Always use latest dynamic profile state from current user session
    const donorName = currentUser.name || 'Valued Donor';
    const currentBloodGroup = currentUser.bloodGroup || record.bloodGroup || 'O+';
    const issueDate = new Date().toISOString().split('T')[0];
    const verificationRefId = `BL-REF-${certId}-${issueDate.replace(/-/g, '')}`;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Outer and inner decorative border
    doc.setDrawColor(220, 38, 38); // blood red #dc2626
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.8);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // Header banner background
    doc.setFillColor(254, 242, 242); // red-50
    doc.rect(15, 15, pageWidth - 30, 28, 'F');

    // BloodLink Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text('BLOODLINK HEALTHCARE NETWORK', pageWidth / 2, 26, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('NATIONAL VOLUNTARY BLOOD TRANSFUSION & REGISTRY PLATFORM', pageWidth / 2, 34, { align: 'center' });

    // Certificate Title - Certificate of Appreciation
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('CERTIFICATE OF APPRECIATION', pageWidth / 2, 56, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('This certificate is proudly and gratefully presented to', pageWidth / 2, 65, { align: 'center' });

    // Current Donor Full Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(donorName.toUpperCase(), pageWidth / 2, 78, { align: 'center' });

    // Underline
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.6);
    const nameWidth = doc.getTextWidth(donorName.toUpperCase());
    doc.line((pageWidth - nameWidth) / 2 - 10, 81, (pageWidth + nameWidth) / 2 + 10, 81);

    // Dynamic Appreciation Message
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(51, 65, 85);
    const appreciation = `In sincere appreciation of your voluntary humanitarian contribution of ${record.units} unit (${record.units * 450} mL) of ${record.donationType || 'Whole Blood'} (Blood Group ${currentBloodGroup}) on ${record.donationDate} at ${record.bloodBankName}. Your heroic gift of life directly supports emergency trauma, critical surgical, and neonatal patient transfusions.`;
    const splitBody = doc.splitTextToSize(appreciation, pageWidth - 60);
    doc.text(splitBody, pageWidth / 2, 90, { align: 'center' });

    // Metadata Details Box
    const boxY = 110;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(25, boxY, pageWidth - 50, 28, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DONATION ID', 35, boxY + 8);
    doc.text('DONATION DATE', 85, boxY + 8);
    doc.text('CURRENT BLOOD GROUP', 135, boxY + 8);
    doc.text('RECEIVING HOUSE / FACILITY', 190, boxY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(certId, 35, boxY + 18);
    doc.text(record.donationDate, 85, boxY + 18);
    doc.setTextColor(220, 38, 38);
    doc.text(currentBloodGroup, 135, boxY + 18);

    // Wrapped Receiving House / Facility text so it never overflows box
    doc.setTextColor(15, 23, 42);
    const receivingHouseFull = `${record.bloodBankName} (${record.bloodBankLocation || 'Metro'})`;
    const splitFacility = doc.splitTextToSize(receivingHouseFull, 72);
    doc.setFontSize(splitFacility.length > 1 ? 8 : 9.5);
    doc.text(splitFacility, 190, boxY + (splitFacility.length > 1 ? 15 : 18));

    // Authorized Signature Area & Verification
    const sigY = 158;

    // Chief Medical Officer
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(35, sigY, 95, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Dr. Aris Thorne, MD', 65, sigY + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Chief Medical Officer, BloodLink', 65, sigY + 10, { align: 'center' });

    // Official Seal in Center
    doc.setDrawColor(220, 38, 38);
    doc.setFillColor(254, 242, 242);
    doc.circle(pageWidth / 2, sigY - 4, 12, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(220, 38, 38);
    doc.text('OFFICIAL SEAL', pageWidth / 2, sigY - 6, { align: 'center' });
    doc.text('VERIFIED', pageWidth / 2, sigY - 1, { align: 'center' });
    doc.text('CLINICAL GRADE', pageWidth / 2, sigY + 4, { align: 'center' });

    // Blood Bank Authority & Issue Date (bounded with splitTextToSize so it never clips)
    doc.line(pageWidth - 95, sigY, pageWidth - 35, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const sigFacilityLines = doc.splitTextToSize(record.bloodBankName, 58);
    doc.text(sigFacilityLines, pageWidth - 65, sigY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const issueDateY = sigY + (sigFacilityLines.length > 1 ? 12 : 9.5);
    doc.text(`Issue Date: ${issueDate}`, pageWidth - 65, issueDateY, { align: 'center' });

    // Footer Security & Verification ID
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Verification Ref: ${verificationRefId} | Certified against National Blood Safety Standards`,
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );

    const filename = `BloodLink_Donation_Certificate_${certId}.pdf`;
    doc.save(filename);

    addToast({
      type: 'success',
      title: 'Certificate Downloaded',
      message: `${filename} has been saved with your latest profile details.`,
    });
  };

  const handleDownloadCert = (record: DonationRecord) => {
    setSelectedCert(record);
  };

  const handleExportCsv = () => {
    exportToCsv(
      `BloodLink_Donation_History_${getTodayDateString()}`,
      donationHistory,
      [
        { header: 'Donation ID', accessor: (r) => r.certificateId || r.id },
        { header: 'Donor Name', accessor: () => currentUser.name || 'Donor' },
        { header: 'Donation Date', accessor: (r) => r.donationDate },
        { header: 'Receiving House / Facility', accessor: (r) => r.bloodBankName },
        { header: 'Facility Location', accessor: (r) => r.bloodBankLocation },
        { header: 'Blood Group', accessor: (r) => currentUser.bloodGroup || r.bloodGroup },
        { header: 'Component Type', accessor: (r) => r.donationType },
        { header: 'Units Donated', accessor: (r) => r.units },
        { header: 'Volume (mL)', accessor: (r) => r.units * 450 },
        { header: 'Status', accessor: (r) => r.status },
        { header: 'Lives Saved Est.', accessor: (r) => r.impactLivesSaved },
      ]
    );

    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `BloodLink_Donation_History_${getTodayDateString()}.csv downloaded successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Donation History & Impact Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official timeline of your voluntary blood donations with downloadable verified certificates and digital donor pass.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" /> View Digital Donor Pass
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900 border-red-200/80 dark:border-red-900/40">
          <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/25 flex-shrink-0">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Donated Units
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              {totalUnits} Units ({totalUnits * 450} mL)
            </h4>
            <span className="text-[11px] text-blood-600 dark:text-blood-400 font-semibold">
              All tested & cleared for clinical use
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-200/80 dark:border-emerald-900/40">
          <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/25 flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Estimated Lives Impacted
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              ~{totalLivesSaved} Patients Saved
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Trauma, surgery & neonatal care
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/40">
          <div className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/25 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Lifesaver Badge Tier
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              Gold Tier Life-Saver
            </h4>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              4 more donations to Platinum Master
            </span>
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blood-600" /> Donation Ledger & Verification Records
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {donationHistory.length} Verified Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Donation Date</th>
                <th className="py-3 px-4">Receiving House / Facility</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Units Harvested</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {donationHistory.map((rec) => {
                const isCompleted = rec.status === 'Completed';
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      📅 {rec.donationDate}
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="font-medium text-slate-900 dark:text-white truncate" title={rec.bloodBankName}>
                        {rec.bloodBankName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate" title={rec.bloodBankLocation}>
                        {rec.bloodBankLocation}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="blood" size="sm">
                        {currentUser.bloodGroup || rec.bloodGroup}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {rec.donationType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {rec.units} Unit ({rec.units * 450} mL)
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={isCompleted ? 'success' : 'warning'} size="sm" dot>
                        {rec.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isCompleted ? (
                        <button
                          onClick={() => handleDownloadCert(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blood-600 dark:text-blood-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 transition-all shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Certificate
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Processing</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Digital Certificate Generator & Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Certificate Preview - Certificate of Appreciation"
          subtitle="Official recognition of voluntary humanitarian blood contribution."
          maxWidth="lg"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-b from-red-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-2 border-red-600/30 text-center relative overflow-hidden shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-blood-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
              <Droplets className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-blood-600 dark:text-blood-400">
              BloodLink Healthcare Network
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Certificate of Appreciation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This acknowledges with deepest gratitude that
            </p>

            <h3 className="text-xl font-bold text-blood-600 dark:text-blood-400 my-2 underline decoration-red-300">
              {currentUser.name || 'Valued Donor'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Voluntarily contributed <strong>{selectedCert.units} unit of {selectedCert.donationType} (Blood Group {currentUser.bloodGroup || selectedCert.bloodGroup})</strong> on{' '}
              <strong>{selectedCert.donationDate}</strong>.
            </p>

            {/* Receiving House / Facility Highlighted Box */}
            <div className="mt-4 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-left max-w-md mx-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Receiving House / Center:
              </span>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blood-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block truncate" title={selectedCert.bloodBankName}>
                    {selectedCert.bloodBankName}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate" title={selectedCert.bloodBankLocation}>
                    {selectedCert.bloodBankLocation}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-left">
              <div>
                <span className="text-slate-400 block font-semibold">Donation ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedCert.certificateId || selectedCert.id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">Verification Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Clinical Quality Certified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              onClick={() => {
                generateAndDownloadPDF(selectedCert);
                setSelectedCert(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF (BloodLink_Donation_Certificate_{selectedCert.certificateId || selectedCert.id}.pdf)
            </button>
            <button
              onClick={() => setSelectedCert(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Digital Donor Pass Modal */}
      <DigitalDonorPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
