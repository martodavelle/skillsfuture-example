import { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  HERO_IMAGE_PATH,
  POPULAR_TOPICS,
  SEARCH_SUGGESTIONS,
} from '../data/courses';
import { CitizenProfile } from '../types/course';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPopularTopic: (topic: string) => void;
  citizen: CitizenProfile | null;
  onOpenSingpass: () => void;
  totalCoursesCount: number;
}

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onSelectPopularTopic,
  citizen,
  onOpenSingpass,
  totalCoursesCount,
}: HeroSearchProps) {
  const [focused, setFocused] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.toLowerCase().includes(searchQuery.trim().toLowerCase());
  }).slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFocused(false);
    const resultsEl = document.getElementById('course-directory-results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-[#1B2B5A] text-white border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Search & Discovery Focal Anchor */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-medium text-rose-200 tracking-wide mb-3">
              SkillsFuture Singapore · Official Course Directory
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.15] text-white text-balance mb-4">
              Find the right course for your next career move
            </h1>
            <p className="text-base text-slate-200 leading-relaxed max-w-2xl mb-6">
              Search {totalCoursesCount} SkillsFuture Credit-eligible courses across
              Singapore&apos;s autonomous universities, polytechnics, and appointed
              training providers.
            </p>

            {/* Search Bar with Autocomplete */}
            <div ref={containerRef} className="relative max-w-2xl mb-5">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 bg-white p-1.5 rounded-xl shadow-lg"
              >
                <div className="relative flex-1 flex items-center">
                  <Search
                    className="w-5 h-5 text-slate-400 ml-3 shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="directory-search" className="sr-only">
                    Search courses, skills, training providers, or course code
                  </label>
                  <input
                    id="directory-search"
                    type="text"
                    value={searchQuery}
                    onFocus={() => setFocused(true)}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      setFocused(true);
                    }}
                    placeholder="Search course title, skill, provider, or TGS code"
                    className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      aria-label="Clear search"
                      className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C81058] hover:bg-[#A60D48] text-white text-sm font-semibold rounded-lg transition-colors duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Search courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {focused && filteredSuggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Search suggestions"
                  className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-slate-900"
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
                            onSearchChange(suggestion);
                            setFocused(false);
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

            {/* Popular Topics Quick Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-300 mr-1">
                Popular searches:
              </span>
              {POPULAR_TOPICS.map((topic) => {
                const isSelected =
                  searchQuery.toLowerCase() === topic.toLowerCase();
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

          {/* Right Column: Stretched Editorial Photo */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-[#142045] min-h-[240px] lg:min-h-[300px]">
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
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white/95">
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

        {/* Full-Width Citizen Summary / Funding Strip Below Split Hero */}
        <div className="mt-8 pt-6 border-t border-slate-700/70">
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
                  ${citizen.levelUpMidCareerBalance.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
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
