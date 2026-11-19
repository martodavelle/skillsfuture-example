import { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Award,
  Calculator,
} from 'lucide-react';
import { CitizenProfile, Course, ResidencyTier } from '../types/course';
import { getEstimatedNetFee } from './CourseCard';

interface CourseDetailModalProps {
  course: Course | null;
  citizen: CitizenProfile | null;
  isSaved: boolean;
  onToggleSave: (courseId: string) => void;
  onClose: () => void;
}

export function CourseDetailModal({
  course,
  citizen,
  isSaved,
  onToggleSave,
  onClose,
}: CourseDetailModalProps) {
  const [residencyTier, setResidencyTier] = useState<ResidencyTier>(
    citizen ? citizen.residencyTier : 'sc-40-plus'
  );
  const [applyCredit, setApplyCredit] = useState(true);
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>('');
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  useEffect(() => {
    if (course) {
      setResidencyTier(citizen ? citizen.residencyTier : 'sc-40-plus');
      setApplyCredit(true);
      setSelectedIntakeId(course.intakes[0]?.id ?? '');
      setEnrolledSuccess(false);
    }
  }, [course, citizen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (course) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [course, onClose]);

  if (!course) return null;

  const feeAfterSubsidy = getEstimatedNetFee(course, residencyTier);
  const subsidyAmount = Math.max(0, course.fullFee - feeAfterSubsidy);

  const isCreditEligibleTier =
    residencyTier === 'sc-40-plus' || residencyTier === 'sc-under-40';
  const isLevelUpCourse = course.schemes.includes(
    'Level-Up Mid-Career ($4,000)'
  );

  const availableCredit = citizen
    ? citizen.openingCreditBalance +
      citizen.oneOffTopUpBalance +
      (isLevelUpCourse ? citizen.levelUpMidCareerBalance : 0)
    : residencyTier === 'sc-40-plus' && isLevelUpCourse
    ? 4500
    : isCreditEligibleTier
    ? 500
    : 0;

  const creditApplied =
    applyCredit && isCreditEligibleTier
      ? Math.min(feeAfterSubsidy, availableCredit)
      : 0;
  const cashPayable = Math.max(0, feeAfterSubsidy - creditApplied);

  const selectedIntake =
    course.intakes.find((i) => i.id === selectedIntakeId) ?? course.intakes[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mb-1">
              <span className="font-semibold text-[#1B2B5A]">
                {course.provider}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-500">
                {course.referenceCode}
              </span>
            </div>
            <h2
              id="course-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug"
            >
              {course.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(course.id)}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark course'}
              className={`px-3 py-2 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                isSaved
                  ? 'bg-[#C81058] text-white border-[#C81058]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close course details"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Details Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quick Spec Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="block text-slate-500 mb-0.5">Duration</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {course.durationLabel}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-0.5">
                    Training Mode
                  </span>
                  <span className="font-semibold text-slate-900">
                    {course.mode}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-0.5">
                    Entry Requirement
                  </span>
                  <span className="font-semibold text-slate-900">
                    {course.minQualification}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 mb-2">
                  Course Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {course.summary}
                </p>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-slate-900 mb-2.5">
                  What You Will Learn
                </h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-[#0F4C81] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1B2B5A] shrink-0" />
                  <span>
                    <strong className="text-slate-900">Certification:</strong>{' '}
                    {course.certificateType}
                  </span>
                </div>
                <p>
                  <strong className="text-slate-900">Skills covered:</strong>{' '}
                  {course.skillsCovered.join(' · ')}
                </p>
                <p>
                  <strong className="text-slate-900">Supported schemes:</strong>{' '}
                  {course.schemes.join(' · ')}
                </p>
              </div>

              {/* Upcoming Intakes */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-display text-sm font-bold text-slate-900 mb-3">
                  Select an Upcoming Intake
                </h3>
                <div className="space-y-2.5">
                  {course.intakes.map((intake) => {
                    const active = selectedIntake?.id === intake.id;
                    return (
                      <label
                        key={intake.id}
                        className={`block p-3.5 rounded-xl border cursor-pointer transition-colors ${
                          active
                            ? 'border-[#1B2B5A] bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="radio"
                              name="courseIntake"
                              checked={active}
                              onChange={() => setSelectedIntakeId(intake.id)}
                              className="mt-1 text-[#1B2B5A] focus:ring-[#1B2B5A]"
                            />
                            <div className="text-xs space-y-1">
                              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#1B2B5A]" />
                                <span className="tabular-nums">
                                  {intake.startDate} – {intake.endDate}
                                </span>
                              </p>
                              <p className="text-slate-600 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{intake.schedule}</span>
                              </p>
                              <p className="text-slate-600 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{intake.location}</span>
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-slate-600 tabular-nums shrink-0">
                            {intake.seatsLeft} seats left
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Interactive Fee & Credit Calculator */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-4 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <Calculator className="w-4 h-4 text-[#C81058]" />
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Fee &amp; SkillsFuture Credit Estimator
                  </h3>
                </div>

                <div>
                  <label
                    htmlFor="residency-tier-select"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Residency &amp; Age Group
                  </label>
                  <select
                    id="residency-tier-select"
                    value={residencyTier}
                    onChange={(e) =>
                      setResidencyTier(e.target.value as ResidencyTier)
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]"
                  >
                    <option value="sc-40-plus">
                      Singapore Citizen (Aged 40 &amp; above)
                    </option>
                    <option value="sc-under-40">
                      Singapore Citizen (Aged 21 – 39)
                    </option>
                    <option value="pr">Singapore Permanent Resident</option>
                    <option value="full-fee">
                      International / Non-Subsidised
                    </option>
                  </select>
                </div>

                {isCreditEligibleTier && (
                  <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyCredit}
                      onChange={(e) => setApplyCredit(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-900 block">
                        Offset with SkillsFuture Credit
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        Est. usable balance: ${availableCredit.toFixed(2)}
                        {!citizen && ' (Estimated)'}
                      </span>
                    </div>
                  </label>
                )}

                <div className="space-y-2.5 text-sm pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Full course fee (incl. GST)</span>
                    <span className="font-mono tabular-nums">
                      ${course.fullFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>SSG Course Fee Subsidy</span>
                    <span className="font-mono tabular-nums">
                      −${subsidyAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Net fee after subsidy</span>
                    <span className="font-mono tabular-nums">
                      ${feeAfterSubsidy.toFixed(2)}
                    </span>
                  </div>
                  {creditApplied > 0 && (
                    <div className="flex items-center justify-between text-[#0F4C81]">
                      <span>SkillsFuture Credit applied</span>
                      <span className="font-mono tabular-nums">
                        −${creditApplied.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-300">
                    <span className="font-display text-sm font-bold text-slate-900">
                      Est. Cash Payable
                    </span>
                    <span className="font-mono text-2xl font-bold text-[#1B2B5A] tabular-nums">
                      ${cashPayable.toFixed(2)}
                    </span>
                  </div>
                </div>

                {enrolledSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Registration Reference Prepared</span>
                    </p>
                    <p className="leading-relaxed">
                      Your intake ({selectedIntake?.startDate}) with{' '}
                      <strong>{course.providerShort}</strong> is ready. Submit
                      your SkillsFuture Credit claim up to 60 days before the
                      course start date using code{' '}
                      <span className="font-mono font-semibold">
                        {course.referenceCode}
                      </span>
                      .
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEnrolledSuccess(true)}
                    className="w-full py-3 px-4 bg-[#C81058] hover:bg-[#A60D48] text-white text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
                  >
                    Register &amp; Prepare Credit Claim
                  </button>
                )}

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Figures include 9% GST where applicable. Final payable amounts
                  are confirmed by {course.providerShort} upon enrolment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
