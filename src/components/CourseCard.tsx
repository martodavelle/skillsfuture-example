import { useState } from 'react';
import { Bookmark, Check, GraduationCap, Star } from 'lucide-react';
import { CitizenProfile, Course, ResidencyTier } from '../types/course';

interface CourseCardProps {
  course: Course;
  citizen: CitizenProfile | null;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (courseId: string) => void;
  onToggleCompare: (courseId: string) => void;
  onOpenDetail: (course: Course) => void;
  viewMode: 'grid' | 'list';
}

export function getEstimatedNetFee(
  course: Course,
  tier: ResidencyTier
): number {
  switch (tier) {
    case 'sc-40-plus':
      return course.subsidizedFeeSc40;
    case 'sc-under-40':
      return course.subsidizedFeeScUnder40;
    case 'pr':
      return course.subsidizedFeePr;
    case 'full-fee':
      return course.fullFee;
  }
}

export function CourseCard({
  course,
  citizen,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenDetail,
  viewMode,
}: CourseCardProps) {
  const [imgError, setImgError] = useState(false);

  const activeTier: ResidencyTier = citizen ? citizen.residencyTier : 'sc-40-plus';
  const netFee = getEstimatedNetFee(course, activeTier);
  const tierLabel =
    activeTier === 'sc-40-plus'
      ? 'Est. fee (SC ≥ 40 yrs)'
      : activeTier === 'sc-under-40'
      ? 'Est. fee (SC < 40 yrs)'
      : 'Est. fee (PR)';

  const isList = viewMode === 'list';

  return (
    <article
      className={`group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md flex ${
        isList ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      {/* 4:3 Image Slot with Zero-Broken-Image Fallback */}
      <div
        className={`relative bg-slate-100 overflow-hidden shrink-0 ${
          isList ? 'sm:w-64 aspect-[4/3] sm:aspect-auto' : 'aspect-[4/3] w-full'
        }`}
      >
        {!imgError ? (
          <img
            src={course.imageUrl}
            alt={course.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
            <GraduationCap className="w-8 h-8 mb-2 text-[#1B2B5A]" />
            <span className="text-xs font-medium text-slate-700">
              {course.area}
            </span>
          </div>
        )}

        {/* Bookmark button in top-right corner */}
        <button
          type="button"
          onClick={() => onToggleSave(course.id)}
          aria-label={isSaved ? 'Remove from saved courses' : 'Save course'}
          aria-pressed={isSaved}
          className={`absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-sm border ${
            isSaved
              ? 'bg-[#C81058] text-white border-[#C81058]'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:text-[#C81058]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-[#1B2B5A]">
              {course.providerShort}
            </span>
            <span aria-hidden="true">·</span>
            <span>{course.mode}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{course.durationLabel}</span>
            {course.featuredTag && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#C81058]">
                  {course.featuredTag}
                </span>
              </>
            )}
          </div>

          {/* Course Title */}
          <h3 className="font-display text-base font-semibold text-slate-900 leading-snug line-clamp-2 mb-2">
            <button
              type="button"
              onClick={() => onOpenDetail(course)}
              className="text-left hover:text-[#0F4C81] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C81] rounded"
            >
              {course.title}
            </button>
          </h3>

          {/* Rating, Reviews & Next Intake */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 mb-2.5">
            <span className="inline-flex items-center gap-1 font-medium text-slate-800 tabular-nums">
              <Star
                className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                aria-hidden="true"
              />
              {course.rating.toFixed(1)}
              <span className="text-slate-500 font-normal">
                ({course.reviewCount})
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              Next intake: {course.nextStartDateDisplay}
            </span>
          </div>

          {/* Unboxed Skills & Funding Summary */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-1 mb-1">
            Skills: {course.skillsCovered.join(' · ')}
          </p>
          <p className="text-xs text-[#0F4C81] font-medium line-clamp-1">
            {course.schemes.join(' · ')}
          </p>
        </div>

        {/* Fee Breakdown & Actions */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <span className="block text-[11px] text-slate-500">
                {tierLabel}
              </span>
              <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                ${netFee.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-slate-500">
                Full fee (incl. GST)
              </span>
              <span className="font-mono text-xs text-slate-500 line-through tabular-nums">
                ${course.fullFee.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(course)}
              className="flex-1 py-2 px-3.5 bg-[#1B2B5A] hover:bg-[#142045] text-white text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2B5A]"
            >
              View course details
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(course.id)}
              aria-pressed={isCompared}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isCompared
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {isCompared && <Check className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
