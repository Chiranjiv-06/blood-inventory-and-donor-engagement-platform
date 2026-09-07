import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  CalendarPlus,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const EligibilityCheck: React.FC = () => {
  const { updateCurrentUser, addToast } = useApp();

  const [age, setAge] = useState<number>(32);
  const [weight, setWeight] = useState<number>(72);
  const [recentIllness, setRecentIllness] = useState<string>('no');
  const [medication, setMedication] = useState<string>('no');
  const [surgery, setSurgery] = useState<string>('no');
  const [pregnancy, setPregnancy] = useState<string>('no');
  const [travel, setTravel] = useState<string>('no');
  const [priorDonationMonths, setPriorDonationMonths] = useState<number>(4);

  const [result, setResult] = useState<'Eligible' | 'Temporarily Ineligible' | 'Needs Review' | null>(null);
  const [reason, setReason] = useState<string>('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();

    let status: 'Eligible' | 'Temporarily Ineligible' | 'Needs Review' = 'Eligible';
    let explanation = 'You meet all current clinical criteria for voluntary whole blood and platelet donation!';

    if (age < 18 || age > 65) {
      status = 'Temporarily Ineligible';
      explanation = 'Standard donor age bracket is between 18 and 65 years.';
    } else if (weight < 50) {
      status = 'Temporarily Ineligible';
      explanation = 'Donors must weigh a minimum of 50 kg (110 lbs) for safe 450ml harvest volume.';
    } else if (recentIllness === 'yes') {
      status = 'Temporarily Ineligible';
      explanation = 'Please allow at least 14 days after full recovery from viral illnesses/fevers.';
    } else if (medication === 'yes' || surgery === 'yes') {
      status = 'Needs Review';
      explanation = 'Certain medications (anticoagulants, antibiotics) and recent surgeries require physician pre-clearance.';
    } else if (pregnancy === 'yes') {
      status = 'Temporarily Ineligible';
      explanation = 'Donation is postponed during pregnancy and for 6 months post-partum.';
    } else if (travel === 'yes') {
      status = 'Needs Review';
      explanation = 'Travel to malaria or dengue endemic zones requires regional deferral review.';
    } else if (priorDonationMonths < 2) {
      status = 'Temporarily Ineligible';
      explanation = 'Whole blood donations require a mandatory 56-day (8-week) interval between sessions.';
    }

    setResult(status);
    setReason(explanation);

    updateCurrentUser({
      eligibilityStatus: status,
      eligibilityReason: explanation,
    });

    addToast({
      type: status === 'Eligible' ? 'success' : status === 'Needs Review' ? 'warning' : 'info',
      title: `Assessment: ${status}`,
      message: explanation,
    });
  };

  const handleReset = () => {
    setResult(null);
    setReason('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Donor Medical Eligibility Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Answer 8 standard health screening questions before attending your appointment.
        </p>
      </div>

      {!result ? (
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleCheck} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Question 1: Age */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  1. Donor Age (Years) *
                </label>
                <input
                  type="number"
                  min="16"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
                <span className="text-[11px] text-slate-400">Standard range: 18 - 65 yrs</span>
              </div>

              {/* Question 2: Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  2. Body Weight (kg) *
                </label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                />
                <span className="text-[11px] text-slate-400">Minimum threshold: 50 kg</span>
              </div>

              {/* Question 3: Recent Illness */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  3. Recent Illness / Cold / Fever in past 14 days?
                </label>
                <div className="flex gap-3">
                  {['no', 'yes'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setRecentIllness(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        recentIllness === opt
                          ? 'bg-blood-600 text-white border-blood-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Current Medication */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  4. Taking prescribed antibiotics or blood thinners?
                </label>
                <div className="flex gap-3">
                  {['no', 'yes'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setMedication(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        medication === opt
                          ? 'bg-blood-600 text-white border-blood-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Surgery History */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  5. Major surgery or endoscopy in past 6 months?
                </label>
                <div className="flex gap-3">
                  {['no', 'yes'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setSurgery(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        surgery === opt
                          ? 'bg-blood-600 text-white border-blood-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 6: Pregnancy Status */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  6. Currently pregnant or gave birth in past 6 months?
                </label>
                <div className="flex gap-3">
                  {['no', 'yes'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setPregnancy(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        pregnancy === opt
                          ? 'bg-blood-600 text-white border-blood-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 7: Travel */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  7. International travel to malaria zones in past year?
                </label>
                <div className="flex gap-3">
                  {['no', 'yes'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setTravel(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        travel === opt
                          ? 'bg-blood-600 text-white border-blood-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 8: Previous Donation Date */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  8. Months since your last blood donation
                </label>
                <select
                  value={priorDonationMonths}
                  onChange={(e) => setPriorDonationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
                >
                  <option value={1}>Less than 2 months ago (Under 56 days)</option>
                  <option value={3}>3 months ago</option>
                  <option value={4}>4 to 6 months ago</option>
                  <option value={12}>Over 1 year ago / First-time donor</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                🔒 Responses are confidential and reviewed under clinical health guidelines.
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all text-sm"
              >
                <Stethoscope className="w-4 h-4" />
                Submit Eligibility Check
              </button>
            </div>
          </form>
        </Card>
      ) : (
        /* Result View */
        <Card className="p-8 text-center animate-slide-up">
          {result === 'Eligible' && (
            <div>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <Badge variant="success" size="lg" dot className="mb-2">
                Eligible to Donate
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                You are medically cleared!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                {reason}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/donor/book"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/25 transition-all"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Proceed to Book Donation
                </Link>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Survey
                </button>
              </div>
            </div>
          )}

          {result === 'Temporarily Ineligible' && (
            <div>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800 shadow-inner">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <Badge variant="warning" size="lg" dot className="mb-2">
                Temporarily Ineligible
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Deferral Period Active
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                {reason}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 transition-colors text-xs sm:text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Assessment
                </button>
              </div>
            </div>
          )}

          {result === 'Needs Review' && (
            <div>
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800 shadow-inner">
                <Stethoscope className="w-8 h-8" />
              </div>
              <Badge variant="medical" size="lg" dot className="mb-2">
                Needs Medical Review
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Physician Consultation Suggested
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                {reason}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/donor/nearby"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all text-xs sm:text-sm"
                >
                  Contact Blood Bank Desk
                </Link>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
