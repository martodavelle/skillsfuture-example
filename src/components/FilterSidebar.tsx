import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import {
  CourseArea,
  DurationBucket,
  FilterState,
  FundingScheme,
  QualificationLevel,
  TrainingMode,
} from '../types/course';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  availableProviders: string[];
  activeFilterCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const COURSE_AREAS: CourseArea[] = [
  'AI & Technology',
  'Data & Analytics',
  'Sustainability & Green Economy',
  'Business & Finance',
  'Food Safety & Hospitality',
  'Healthcare & Care Economy',
];

const FUNDING_SCHEMES: FundingScheme[] = [
  'SkillsFuture Credit',
  'Level-Up Mid-Career ($4,000)',
  'Career Transition (SCTP)',
  'Workfare Skills Support',
];

const TRAINING_MODES: TrainingMode[] = [
  'Classroom',
  'Blended',
  'Online Live',
  'Self-Paced E-Learning',
];

const DURATION_BUCKETS: DurationBucket[] = [
  'Under 16 hrs',
  '16 – 40 hrs',
  '40+ hrs',
];

const QUALIFICATIONS: QualificationLevel[] = [
  'No Formal Qualification',
  'Secondary / O-Level',
  'Diploma / ITE',
  "Bachelor's Degree",
];

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  availableProviders,
  activeFilterCount,
  mobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1B2B5A]" />
          <h2 className="font-display text-sm font-bold text-slate-900">
            Filter courses
            {activeFilterCount > 0 && (
              <span className="ml-1.5 font-mono text-xs text-[#C81058] tabular-nums">
                ({activeFilterCount})
              </span>
            )}
          </h2>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0F4C81] hover:text-[#0B3961] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset all</span>
          </button>
        )}
      </div>

      {/* Show courses without fixed start date */}
      <div className="pb-4 border-b border-slate-200">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.showNoStartDate}
            onChange={(e) =>
              onChange({ ...filters, showNoStartDate: e.target.checked })
            }
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            Include self-paced courses without a fixed start date
          </span>
        </label>
      </div>

      {/* SkillsFuture Schemes */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          SkillsFuture Schemes
        </legend>
        <div className="space-y-2">
          {FUNDING_SCHEMES.map((scheme) => (
            <label
              key={scheme}
              className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.schemes.includes(scheme)}
                onChange={() =>
                  onChange({
                    ...filters,
                    schemes: toggleItem(filters.schemes, scheme),
                  })
                }
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="text-xs leading-snug">{scheme}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Course Area */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Course Area
        </legend>
        <div className="space-y-2">
          {COURSE_AREAS.map((area) => (
            <label
              key={area}
              className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.areas.includes(area)}
                onChange={() =>
                  onChange({
                    ...filters,
                    areas: toggleItem(filters.areas, area),
                  })
                }
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="text-xs leading-snug">{area}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Estimated Out-of-Pocket Fee */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Max Est. Net Fee (after subsidy)
        </legend>
        <div className="space-y-2">
          {[
            { label: 'Any fee', value: null },
            { label: 'Under $150', value: 150 },
            { label: 'Under $300', value: 300 },
            { label: 'Under $600', value: 600 },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="radio"
                name="maxNetFee"
                checked={filters.maxNetFee === opt.value}
                onChange={() => onChange({ ...filters, maxNetFee: opt.value })}
                className="w-4 h-4 border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="tabular-nums">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Mode of Training */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Mode of Training
        </legend>
        <div className="space-y-2">
          {TRAINING_MODES.map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.modes.includes(mode)}
                onChange={() =>
                  onChange({
                    ...filters,
                    modes: toggleItem(filters.modes, mode),
                  })
                }
                className="w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Course Duration */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Course Duration
        </legend>
        <div className="space-y-2">
          {DURATION_BUCKETS.map((bucket) => (
            <label
              key={bucket}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.durationBuckets.includes(bucket)}
                onChange={() =>
                  onChange({
                    ...filters,
                    durationBuckets: toggleItem(filters.durationBuckets, bucket),
                  })
                }
                className="w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="tabular-nums">{bucket}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Training Provider */}
      <fieldset className="pb-5 border-b border-slate-200">
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Training Provider
        </legend>
        <div className="space-y-2">
          {availableProviders.map((provider) => (
            <label
              key={provider}
              className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.providers.includes(provider)}
                onChange={() =>
                  onChange({
                    ...filters,
                    providers: toggleItem(filters.providers, provider),
                  })
                }
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="leading-snug">{provider}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Minimum Qualification */}
      <fieldset>
        <legend className="text-xs font-semibold text-slate-900 mb-2.5">
          Minimum Entry Qualification
        </legend>
        <div className="space-y-2">
          {QUALIFICATIONS.map((qual) => (
            <label
              key={qual}
              className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.minQualifications.includes(qual)}
                onChange={() =>
                  onChange({
                    ...filters,
                    minQualifications: toggleItem(
                      filters.minQualifications,
                      qual
                    ),
                  })
                }
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C81058] focus:ring-[#C81058]"
              />
              <span className="leading-snug">{qual}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Course filters"
        className="hidden lg:block w-72 shrink-0 bg-white border border-slate-200 rounded-xl p-5 self-start"
      >
        {filterContent}
      </aside>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Course filters"
        >
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-full max-w-xs bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-base font-bold text-slate-900">
                Refine Results
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-[#1B2B5A] text-white text-sm font-semibold rounded-lg"
              >
                Show matching courses
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
