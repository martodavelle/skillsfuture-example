import { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Briefcase,
  Clock,
  Wallet,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  HERO_IMAGE_PATH,
  POPULAR_TOPICS,
  SEARCH_SUGGESTIONS,
} from '../data/courses';
import {
  CitizenProfile,
  DurationBucket,
  FilterState,
  SkillsCategory,
} from '../types/course';

interface HeroSearchProps {
  filters: FilterState;
  onFiltersChange: (next: FilterState) => void;
  onSelectPopularTopic: (topic: string) => void;
  citizen: CitizenProfile | null;
  onOpenSingpass: () => void;
  totalCoursesCount: number;
}

type OpenSegment = 'search' | 'category' | 'duration' | 'cost' | null;

const CATEGORY_OPTIONS: {
  value: SkillsCategory | 'all';
  label: string;
  description: string;
}[] = [
  {
    value: 'all',
    label: 'All (Work & Hobbies)',
    description: 'Browse every SkillsFuture-eligible course',
  },
  {
    value: 'Work & Career',
    label: 'Work & Career',
    description: 'WSQ, SCTP, AI, sustainability & professional skills',
  },
  {
    value: 'Hobbies & Personal',
    label: 'Hobbies & Personal',
    description: 'Culinary baking, gardening, languages & enrichment',
  },
];

const DURATION_OPTIONS: {
  value: DurationBucket;
  label: string;
  sublabel: string;
}[] = [
  { value: 'Under 16 hrs', label: 'Under 16 hrs', sublabel: '1–2 day short workshops' },
  { value: '16 – 40 hrs', label: '16 – 40 hrs', sublabel: 'Multi-day or evening modular' },
  { value: '40+ hrs', label: '40+ hrs', sublabel: 'Specialist certs & SCTP tracks' },
];

const COST_OPTIONS: {
  value: number | null;
  label: string;
  sublabel: string;
}[] = [
  { value: null, label: 'Any cost', sublabel: 'Show all course fee ranges' },
  { value: 150, label: 'Under $150', sublabel: 'Est. net fee after subsidy' },
  { value: 300, label: 'Under $300', sublabel: 'Est. net fee after subsidy' },
  { value: 600, label: 'Under $600', sublabel: 'Est. net fee after subsidy' },
];

export function HeroSearch({
  filters,
  onFiltersChange,
  onSelectPopularTopic,
  citizen,
  onOpenSingpass,
  totalCoursesCount,
}: HeroSearchProps) {
  const [openSegment, setOpenSegment] = useState<OpenSegment>(null);
  const [heroImgError, setHeroImgError] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenSegment(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenSegment(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((item) => {
    if (!filters.searchQuery.trim()) return true;
    return item.toLowerCase().includes(filters.searchQuery.trim().toLowerCase());
  }).slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSegment(null);
    const resultsEl = document.getElementById('course-directory-results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categorySummary =
    filters.skillsCategory === 'all'
      ? 'Work & Hobbies'
      : filters.skillsCategory;

  const durationSummary =
    filters.durationBuckets.length === 0
      ? 'Any duration'
      : filters.durationBuckets.length === 1
      ? filters.durationBuckets[0]
      : `${filters.durationBuckets.length} durations`;

  const costSummary =
    filters.maxNetFee === null ? 'Any cost' : `Under $${filters.maxNetFee}`;

  const toggleDuration = (bucket: DurationBucket) => {
    const next = filters.durationBuckets.includes(bucket)
      ? filters.durationBuckets.filter((b) => b !== bucket)
      : [...filters.durationBuckets, bucket];
    onFiltersChange({ ...filters, durationBuckets: next });
  };

  return (
    <section className="bg-[#1B2B5A] text-white border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-12 lg:pb-12">
        {/* Top Split: Headline + Editorial Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-medium text-rose-200 tracking-wide mb-3">
              SkillsFuture Singapore · Official Course Directory
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.15] text-white text-balance mb-4">
              Find the right course for your next career move
            </h1>
            <p className="text-base text-slate-200 leading-relaxed max-w-2xl mb-5">
              Search {totalCoursesCount} SkillsFuture Credit-eligible courses across
              Singapore&apos;s autonomous universities, polytechnics, and appointed
              training providers.
            </p>

            {/* Popular Topics Quick Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-300 mr-1">
                Popular searches:
              </span>
              {POPULAR_TOPICS.map((topic) => {
                const isSelected =
                  filters.searchQuery.toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() =>
                      onSelectPopularTopic(isSelected ? '' : topic)
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#1B2B5A] border-white font-semibold'
                        : 'bg-[#243770] text-slate-100 border-slate-600/60 hover:bg-[#2C4285] hover:border-slate-400'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-[#142045] min-h-[210px] lg:min-h-[240px]">
              {!heroImgError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Singapore professionals collaborating in a bright lifelong learning hub"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1B2B5A] to-[#0F172A]">
                  <ShieldCheck className="w-10 h-10 text-rose-300 mb-3" />
                  <p className="font-display text-base font-semibold text-white">
                    SkillsFuture Singapore Learning Network
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Verified training providers and subsidised pathways
                  </p>
                </div>
              )}
              <div
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white/95">
                <span className="font-medium">
                  Eligible for SkillsFuture Credit &amp; Level-Up Programme
                </span>
                <span className="font-mono tabular-nums text-white/85 shrink-0">
                  Up to 90% subsidy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Multi-Segment Search Bar (Amber-Framed Segmented Bar) */}
        <div ref={barRef} className="mt-8 relative z-30">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFB700] p-1 rounded-xl shadow-xl flex flex-col lg:flex-row items-stretch gap-1 text-slate-900"
          >
            {/* Segment 1: Keyword Search */}
            <div className="relative flex-[1.55] min-w-0 bg-white rounded-lg flex items-center px-3.5 py-2 focus-within:ring-2 focus-within:ring-[#006CE4]">
              <Search
                className="w-5 h-5 text-slate-500 shrink-0 mr-3"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="directory-search"
                  className="block text-[11px] font-medium text-slate-500 leading-tight"
                >
                  Search in your own words
                </label>
                <input
                  id="directory-search"
                  type="text"
                  value={filters.searchQuery}
                  onFocus={() => setOpenSegment('search')}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, searchQuery: e.target.value });
                    setOpenSegment('search');
                  }}
                  placeholder="AI, baking, Python, NUS-ISS..."
                  className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-transparent focus:outline-none truncate"
                />
              </div>
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange({ ...filters, searchQuery: '' })
                  }
                  aria-label="Clear search"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Keyword Autocomplete Popover */}
              {openSegment === 'search' && filteredSuggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Search suggestions"
                  className="absolute z-40 left-0 right-0 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-slate-900"
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 text-xs font-medium text-slate-500">
                    Suggested courses &amp; providers
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {filteredSuggestions.map((suggestion) => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          onClick={() => {
                            onFiltersChange({
                              ...filters,
                              searchQuery: suggestion,
                            });
                            setOpenSegment(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1B2B5A] flex items-center gap-2.5 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{suggestion}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Segment 2: Skills Category (Hobbies or Work) */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                aria-expanded={openSegment === 'category'}
                aria-haspopup="listbox"
                onClick={() =>
                  setOpenSegment((prev) =>
                    prev === 'category' ? null : 'category'
                  )
                }
                className={`w-full h-full bg-white hover:bg-slate-50 rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                  openSegment === 'category' ? 'ring-2 ring-[#006CE4]' : ''
                }`}
              >
                <div className="flex items-center min-w-0 gap-3">
                  <Briefcase
                    className="w-5 h-5 text-slate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-500 leading-tight whitespace-nowrap">
                      Skills category
                    </span>
                    <span className="block text-sm font-semibold text-slate-900 truncate">
                      {categorySummary}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                    openSegment === 'category' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openSegment === 'category' && (
                <div
                  role="listbox"
                  aria-label="Skills category options"
                  className="absolute z-40 left-0 right-0 lg:w-72 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-xl shadow-2xl p-2 space-y-1"
                >
                  {CATEGORY_OPTIONS.map((opt) => {
                    const selected = filters.skillsCategory === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          onFiltersChange({
                            ...filters,
                            skillsCategory: opt.value,
                          });
                          setOpenSegment(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                          selected
                            ? 'bg-blue-50 text-[#006CE4]'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-semibold">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5">
                            {opt.description}
                          </span>
                        </div>
                        {selected && (
                          <Check className="w-4 h-4 text-[#006CE4] shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Segment 3: Duration of Course */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                aria-expanded={openSegment === 'duration'}
                aria-haspopup="dialog"
                onClick={() =>
                  setOpenSegment((prev) =>
                    prev === 'duration' ? null : 'duration'
                  )
                }
                className={`w-full h-full bg-white hover:bg-slate-50 rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                  openSegment === 'duration' ? 'ring-2 ring-[#006CE4]' : ''
                }`}
              >
                <div className="flex items-center min-w-0 gap-3">
                  <Clock
                    className="w-5 h-5 text-slate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-500 leading-tight whitespace-nowrap">
                      Duration of course
                    </span>
                    <span className="block text-sm font-semibold text-slate-900 tabular-nums truncate">
                      {durationSummary}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                    openSegment === 'duration' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openSegment === 'duration' && (
                <div className="absolute z-40 left-0 right-0 lg:w-72 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-xl shadow-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">
                      Select course duration
                    </span>
                    {filters.durationBuckets.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          onFiltersChange({ ...filters, durationBuckets: [] })
                        }
                        className="text-xs font-medium text-[#006CE4] hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {DURATION_OPTIONS.map((opt) => {
                      const checked = filters.durationBuckets.includes(
                        opt.value
                      );
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            checked ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDuration(opt.value)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#006CE4] focus:ring-[#006CE4]"
                          />
                          <div>
                            <span className="block text-sm font-semibold text-slate-900 tabular-nums">
                              {opt.label}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {opt.sublabel}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenSegment(null)}
                    className="w-full py-2 bg-[#006CE4] hover:bg-[#0057B8] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Segment 4: Cost of Course */}
            <div className="relative flex-1 min-w-0">
              <button
                type="button"
                aria-expanded={openSegment === 'cost'}
                aria-haspopup="listbox"
                onClick={() =>
                  setOpenSegment((prev) => (prev === 'cost' ? null : 'cost'))
                }
                className={`w-full h-full bg-white hover:bg-slate-50 rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                  openSegment === 'cost' ? 'ring-2 ring-[#006CE4]' : ''
                }`}
              >
                <div className="flex items-center min-w-0 gap-3">
                  <Wallet
                    className="w-5 h-5 text-slate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-500 leading-tight whitespace-nowrap">
                      Cost of course
                    </span>
                    <span className="block text-sm font-semibold text-slate-900 tabular-nums truncate">
                      {costSummary}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                    openSegment === 'cost' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openSegment === 'cost' && (
                <div
                  role="listbox"
                  aria-label="Cost of course options"
                  className="absolute z-40 left-0 right-0 lg:right-0 lg:left-auto lg:w-64 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-xl shadow-2xl p-2 space-y-1"
                >
                  {COST_OPTIONS.map((opt) => {
                    const selected = filters.maxNetFee === opt.value;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          onFiltersChange({ ...filters, maxNetFee: opt.value });
                          setOpenSegment(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                          selected
                            ? 'bg-blue-50 text-[#006CE4]'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-semibold tabular-nums">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {opt.sublabel}
                          </span>
                        </div>
                        {selected && (
                          <Check className="w-4 h-4 text-[#006CE4] shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Segment 5: Primary Search CTA */}
            <button
              type="submit"
              className="px-7 py-3 lg:py-0 bg-[#006CE4] hover:bg-[#0057B8] text-white text-base font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Search
            </button>
          </form>
        </div>

        {/* Full-Width Citizen Summary / Funding Strip Below Hero */}
        <div className="mt-7 pt-6 border-t border-slate-700/70">
          {citizen ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#142045] border border-slate-700/70 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-300">Signed in via Singpass</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {citizen.name}{' '}
                  <span className="font-mono text-xs text-slate-300">
                    ({citizen.nricMasked})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-300">
                  Opening + One-Off Credit
                </p>
                <p className="text-base font-semibold font-mono tabular-nums text-white mt-0.5">
                  $
                  {(
                    citizen.openingCreditBalance + citizen.oneOffTopUpBalance
                  ).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-300">
                  Level-Up Mid-Career Credit
                </p>
                <p className="text-base font-semibold font-mono tabular-nums text-emerald-300 mt-0.5">
                  $
                  {citizen.levelUpMidCareerBalance.toLocaleString('en-SG', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-3">
                <div className="lg:text-right">
                  <p className="text-xs text-slate-300">Active Subsidy Tier</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    Citizen ({citizen.ageGroup})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenSingpass}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Switch profile
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-base font-semibold tabular-nums text-rose-300">
                  $500
                </span>
                <span className="text-xs text-slate-200 leading-relaxed">
                  Base SkillsFuture Credit for Singapore Citizens aged 25+
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-base font-semibold tabular-nums text-emerald-300">
                  $4,000
                </span>
                <span className="text-xs text-slate-200 leading-relaxed">
                  SkillsFuture Level-Up mid-career top-up for Citizens aged 40+
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-base font-semibold tabular-nums text-sky-300">
                  70–90%
                </span>
                <span className="text-xs text-slate-200 leading-relaxed">
                  Course fee subsidies on SSG-supported programmes
                </span>
              </div>
              <div className="flex items-center lg:justify-end">
                <button
                  type="button"
                  onClick={onOpenSingpass}
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-rose-200 cursor-pointer"
                >
                  Log in with Singpass to view your exact credit balance →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
