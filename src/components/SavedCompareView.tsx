import { Bookmark, Trash2, ArrowRight, Scale } from 'lucide-react';
import { ActiveSection, CitizenProfile, Course } from '../types/course';
import { CourseCard, getEstimatedNetFee } from './CourseCard';

interface SavedCompareViewProps {
  savedCourses: Course[];
  comparedCourses: Course[];
  citizen: CitizenProfile | null;
  savedIds: string[];
  comparedIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onClearCompare: () => void;
  onOpenDetail: (course: Course) => void;
  onNavigate: (section: ActiveSection) => void;
}

export function SavedCompareView({
  savedCourses,
  comparedCourses,
  citizen,
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onClearCompare,
  onOpenDetail,
  onNavigate,
}: SavedCompareViewProps) {
  const tier = citizen ? citizen.residencyTier : 'sc-40-plus';

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Side-by-Side Comparison Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#1B2B5A]" />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Course Comparison ({comparedCourses.length}/3)
              </h1>
              <p className="text-xs text-slate-500">
                Compare training duration, subsidised fees, and upcoming intake
                dates side by side.
              </p>
            </div>
          </div>

          {comparedCourses.length > 0 && (
            <button
              type="button"
              onClick={onClearCompare}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear comparison</span>
            </button>
          )}
        </div>

        {comparedCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p>
              No courses selected for comparison yet. Click{' '}
              <strong>Compare</strong> on up to 3 courses in the directory.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2B5A] hover:text-[#C81058] whitespace-nowrap cursor-pointer"
            >
              <span>Browse courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3.5 px-4 text-xs font-semibold text-slate-600 w-44">
                    Attribute
                  </th>
                  {comparedCourses.map((c) => (
                    <th
                      key={c.id}
                      className="py-3.5 px-4 font-display font-bold text-slate-900 min-w-[220px] align-top"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(c)}
                          className="text-left hover:text-[#0F4C81] cursor-pointer"
                        >
                          {c.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleCompare(c.id)}
                          aria-label={`Remove ${c.title} from comparison`}
                          className="text-xs text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Training Provider
                  </td>
                  {comparedCourses.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-slate-900">
                      {c.providerShort}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Mode &amp; Duration
                  </td>
                  {comparedCourses.map((c) => (
                    <td
                      key={c.id}
                      className="py-3 px-4 text-slate-900 tabular-nums"
                    >
                      {c.mode} · {c.durationLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Full Fee (incl. GST)
                  </td>
                  {comparedCourses.map((c) => (
                    <td
                      key={c.id}
                      className="py-3 px-4 font-mono text-slate-600 tabular-nums"
                    >
                      ${c.fullFee.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Est. Net Fee
                  </td>
                  {comparedCourses.map((c) => (
                    <td
                      key={c.id}
                      className="py-3 px-4 font-mono font-bold text-[#1B2B5A] tabular-nums"
                    >
                      ${getEstimatedNetFee(c, tier).toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Next Intake
                  </td>
                  {comparedCourses.map((c) => (
                    <td
                      key={c.id}
                      className="py-3 px-4 text-slate-900 tabular-nums"
                    >
                      {c.nextStartDateDisplay}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Entry Qualification
                  </td>
                  {comparedCourses.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-slate-700">
                      {c.minQualification}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Saved / Bookmarked Courses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
          <Bookmark className="w-5 h-5 text-[#C81058]" />
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Saved Courses ({savedCourses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Your shortlisted SkillsFuture courses for upcoming enrolment.
            </p>
          </div>
        </div>

        {savedCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-600">
              You have not bookmarked any courses yet.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="px-4 py-2 bg-[#1B2B5A] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Discover courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                citizen={citizen}
                isSaved={savedIds.includes(course.id)}
                isCompared={comparedIds.includes(course.id)}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
                onOpenDetail={onOpenDetail}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
