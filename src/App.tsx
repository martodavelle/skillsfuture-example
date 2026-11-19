import { useMemo, useState } from 'react';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Scale,
  RotateCcw,
} from 'lucide-react';
import { COURSES, INITIAL_FILTERS } from './data/courses';
import {
  ActiveSection,
  CitizenProfile,
  Course,
  CourseArea,
  DurationBucket,
  FilterState,
  FundingScheme,
  SortOption,
} from './types/course';
import { GovMasthead } from './components/GovMasthead';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterSidebar } from './components/FilterSidebar';
import { CourseCard, getEstimatedNetFee } from './components/CourseCard';
import { CourseDetailModal } from './components/CourseDetailModal';
import { FundingView } from './components/FundingView';
import { AdvisoryView } from './components/AdvisoryView';
import { SavedCompareView } from './components/SavedCompareView';
import { SingpassModal } from './components/SingpassModal';
import { Footer } from './components/Footer';

function getDurationBucket(hours: number): DurationBucket {
  if (hours < 16) return 'Under 16 hrs';
  if (hours <= 40) return '16 – 40 hrs';
  return '40+ hrs';
}

export default function App() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>('directory');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('best-match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [singpassOpen, setSingpassOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>(['crs-001', 'crs-003']);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  const availableProviders = useMemo(
    () => Array.from(new Set(COURSES.map((c) => c.providerShort))).sort(),
    []
  );

  const activeTier = citizen ? citizen.residencyTier : 'sc-40-plus';

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count += 1;
    if (filters.skillsCategory !== 'all') count += 1;
    count += filters.areas.length;
    count += filters.schemes.length;
    count += filters.modes.length;
    count += filters.durationBuckets.length;
    count += filters.providers.length;
    count += filters.minQualifications.length;
    if (filters.maxNetFee !== null) count += 1;
    if (!filters.showNoStartDate) count += 1;
    return count;
  }, [filters]);

  const filteredCourses = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    const matched = COURSES.filter((course) => {
      if (!filters.showNoStartDate && !course.hasFixedStartDate) {
        return false;
      }
      if (q) {
        const haystack = [
          course.title,
          course.provider,
          course.providerShort,
          course.referenceCode,
          course.area,
          course.skillsCategory,
          course.summary,
          ...course.skillsCovered,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (
        filters.skillsCategory !== 'all' &&
        course.skillsCategory !== filters.skillsCategory
      ) {
        return false;
      }
      if (filters.areas.length > 0 && !filters.areas.includes(course.area)) {
        return false;
      }
      if (
        filters.schemes.length > 0 &&
        !filters.schemes.some((s) => course.schemes.includes(s))
      ) {
        return false;
      }
      if (filters.modes.length > 0 && !filters.modes.includes(course.mode)) {
        return false;
      }
      if (
        filters.durationBuckets.length > 0 &&
        !filters.durationBuckets.includes(
          getDurationBucket(course.durationHours)
        )
      ) {
        return false;
      }
      if (
        filters.providers.length > 0 &&
        !filters.providers.includes(course.providerShort)
      ) {
        return false;
      }
      if (
        filters.minQualifications.length > 0 &&
        !filters.minQualifications.includes(course.minQualification)
      ) {
        return false;
      }
      if (filters.maxNetFee !== null) {
        const net = getEstimatedNetFee(course, activeTier);
        if (net > filters.maxNetFee) return false;
      }
      return true;
    });

    const sorted = [...matched];
    switch (sortBy) {
      case 'lowest-fee':
        sorted.sort(
          (a, b) =>
            getEstimatedNetFee(a, activeTier) -
            getEstimatedNetFee(b, activeTier)
        );
        break;
      case 'highest-rated':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'shortest-duration':
        sorted.sort((a, b) => a.durationHours - b.durationHours);
        break;
      case 'earliest-date':
        sorted.sort((a, b) => {
          if (!a.nextStartDateISO && !b.nextStartDateISO) return 0;
          if (!a.nextStartDateISO) return 1;
          if (!b.nextStartDateISO) return -1;
          return a.nextStartDateISO.localeCompare(b.nextStartDateISO);
        });
        break;
      case 'best-match':
      default:
        sorted.sort((a, b) => {
          const aFeat = a.featuredTag ? 1 : 0;
          const bFeat = b.featuredTag ? 1 : 0;
          if (bFeat !== aFeat) return bFeat - aFeat;
          return b.enrolledCount - a.enrolledCount;
        });
        break;
    }

    return sorted;
  }, [filters, sortBy, activeTier]);

  const savedCourses = useMemo(
    () => COURSES.filter((c) => savedIds.includes(c.id)),
    [savedIds]
  );

  const comparedCourses = useMemo(
    () => COURSES.filter((c) => comparedIds.includes(c.id)),
    [comparedIds]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleSelectPopularTopic = (topic: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: topic }));
    setActiveSection('directory');
  };

  const handleFilterByScheme = (scheme: FundingScheme) => {
    setFilters({ ...INITIAL_FILTERS, schemes: [scheme] });
  };

  const handleFilterByArea = (area: CourseArea) => {
    setFilters({ ...INITIAL_FILTERS, areas: [area] });
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const activeFilterTokens: { label: string; onRemove: () => void }[] = [];
  if (filters.searchQuery.trim()) {
    activeFilterTokens.push({
      label: `Search: "${filters.searchQuery.trim()}"`,
      onRemove: () => setFilters((p) => ({ ...p, searchQuery: '' })),
    });
  }
  if (filters.skillsCategory !== 'all') {
    activeFilterTokens.push({
      label: `Category: ${filters.skillsCategory}`,
      onRemove: () => setFilters((p) => ({ ...p, skillsCategory: 'all' })),
    });
  }
  filters.schemes.forEach((s) =>
    activeFilterTokens.push({
      label: s,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          schemes: p.schemes.filter((x) => x !== s),
        })),
    })
  );
  filters.areas.forEach((a) =>
    activeFilterTokens.push({
      label: a,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          areas: p.areas.filter((x) => x !== a),
        })),
    })
  );
  filters.modes.forEach((m) =>
    activeFilterTokens.push({
      label: m,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          modes: p.modes.filter((x) => x !== m),
        })),
    })
  );
  filters.durationBuckets.forEach((d) =>
    activeFilterTokens.push({
      label: d,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          durationBuckets: p.durationBuckets.filter((x) => x !== d),
        })),
    })
  );
  filters.providers.forEach((prov) =>
    activeFilterTokens.push({
      label: prov,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          providers: p.providers.filter((x) => x !== prov),
        })),
    })
  );
  filters.minQualifications.forEach((q) =>
    activeFilterTokens.push({
      label: q,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          minQualifications: p.minQualifications.filter((x) => x !== q),
        })),
    })
  );
  if (filters.maxNetFee !== null) {
    activeFilterTokens.push({
      label: `Net fee ≤ $${filters.maxNetFee}`,
      onRemove: () => setFilters((p) => ({ ...p, maxNetFee: null })),
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <GovMasthead />

      <Header
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedIds.length}
        citizen={citizen}
        onOpenSingpass={() => setSingpassOpen(true)}
      />

      <main className="flex-1">
        {activeSection === 'directory' && (
          <>
            <HeroSearch
              filters={filters}
              onFiltersChange={setFilters}
              onSelectPopularTopic={handleSelectPopularTopic}
              citizen={citizen}
              onOpenSingpass={() => setSingpassOpen(true)}
              totalCoursesCount={COURSES.length}
            />

            <section
              id="course-directory-results"
              className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  availableProviders={availableProviders}
                  activeFilterCount={activeFilterCount}
                  mobileOpen={mobileFilterOpen}
                  onCloseMobile={() => setMobileFilterOpen(false)}
                />

                <div className="flex-1 min-w-0 w-full">
                  {/* Results Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setMobileFilterOpen(true)}
                        className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>
                          Filters
                          {activeFilterCount > 0
                            ? ` (${activeFilterCount})`
                            : ''}
                        </span>
                      </button>

                      <p className="text-sm text-slate-700 tabular-nums">
                        Showing{' '}
                        <strong className="font-semibold text-slate-900">
                          {filteredCourses.length}
                        </strong>{' '}
                        of {COURSES.length} courses
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="sort-courses-select"
                          className="text-xs text-slate-500 whitespace-nowrap"
                        >
                          Sort by:
                        </label>
                        <select
                          id="sort-courses-select"
                          value={sortBy}
                          onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] cursor-pointer"
                        >
                          <option value="best-match">Best match</option>
                          <option value="lowest-fee">
                            Lowest fee after subsidy
                          </option>
                          <option value="highest-rated">Highest rated</option>
                          <option value="shortest-duration">
                            Shortest duration
                          </option>
                          <option value="earliest-date">
                            Earliest start date
                          </option>
                        </select>
                      </div>

                      <div
                        className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200"
                        role="group"
                        aria-label="Results view layout"
                      >
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          aria-label="Grid view"
                          aria-pressed={viewMode === 'grid'}
                          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                            viewMode === 'grid'
                              ? 'bg-white text-[#1B2B5A] shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          aria-label="List view"
                          aria-pressed={viewMode === 'list'}
                          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                            viewMode === 'list'
                              ? 'bg-white text-[#1B2B5A] shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filter Removable Buttons */}
                  {activeFilterTokens.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {activeFilterTokens.map((token) => (
                        <button
                          key={token.label}
                          type="button"
                          onClick={token.onRemove}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 hover:border-slate-400 rounded-md text-xs font-medium text-slate-700 cursor-pointer"
                        >
                          <span>{token.label}</span>
                          <X className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-medium text-[#0F4C81] hover:underline ml-1 cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Course Grid / List */}
                  {filteredCourses.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
                      <p className="font-display text-lg font-bold text-slate-900">
                        No courses match your selected filters
                      </p>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Try clearing a few filter selections or searching a broader
                        skill keyword such as &ldquo;AI&rdquo;, &ldquo;Data&rdquo;,
                        or &ldquo;Sustainability&rdquo;.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2B5A] hover:bg-[#142045] text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                          : 'space-y-4'
                      }
                    >
                      {filteredCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          citizen={citizen}
                          isSaved={savedIds.includes(course.id)}
                          isCompared={comparedIds.includes(course.id)}
                          onToggleSave={toggleSave}
                          onToggleCompare={toggleCompare}
                          onOpenDetail={setSelectedCourse}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === 'funding' && (
          <FundingView
            citizen={citizen}
            onOpenSingpass={() => setSingpassOpen(true)}
            onFilterByScheme={handleFilterByScheme}
            onNavigate={setActiveSection}
          />
        )}

        {activeSection === 'advice' && (
          <AdvisoryView
            onSelectArea={handleFilterByArea}
            onNavigate={setActiveSection}
          />
        )}

        {activeSection === 'saved' && (
          <SavedCompareView
            savedCourses={savedCourses}
            comparedCourses={comparedCourses}
            citizen={citizen}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={toggleSave}
            onToggleCompare={toggleCompare}
            onClearCompare={() => setComparedIds([])}
            onOpenDetail={setSelectedCourse}
            onNavigate={setActiveSection}
          />
        )}
      </main>

      {/* Compact Floating Compare Bar (only when courses are selected in directory) */}
      {activeSection === 'directory' && comparedIds.length > 0 && (
        <div className="sticky bottom-3 z-30 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="pointer-events-auto bg-[#1B2B5A] text-white rounded-xl shadow-xl border border-slate-700 px-4 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Scale className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="font-medium tabular-nums">
                {comparedIds.length} of 3 courses selected for comparison
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparedIds([])}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSection('saved');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 bg-[#C81058] hover:bg-[#A60D48] text-white text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer"
              >
                Compare side by side
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer
        onNavigate={(section) => {
          setActiveSection(section);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTopic={handleSelectPopularTopic}
      />

      <CourseDetailModal
        course={selectedCourse}
        citizen={citizen}
        isSaved={selectedCourse ? savedIds.includes(selectedCourse.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelectedCourse(null)}
      />

      <SingpassModal
        open={singpassOpen}
        currentCitizen={citizen}
        onSelectCitizen={setCitizen}
        onClose={() => setSingpassOpen(false)}
      />
    </div>
  );
}
