import { useState } from 'react';
import { ArrowRight, CheckCircle2, Calculator } from 'lucide-react';
import { ActiveSection, CitizenProfile, FundingScheme } from '../types/course';

interface FundingViewProps {
  citizen: CitizenProfile | null;
  onOpenSingpass: () => void;
  onFilterByScheme: (scheme: FundingScheme) => void;
  onNavigate: (section: ActiveSection) => void;
}

export function FundingView({
  citizen,
  onOpenSingpass,
  onFilterByScheme,
  onNavigate,
}: FundingViewProps) {
  const [simCourseFee, setSimCourseFee] = useState(2000);
  const [simAge, setSimAge] = useState<'40plus' | '25to39'>(
    citizen?.ageGroup === '25 to 39' ? '25to39' : '40plus'
  );
  const [simUseCredit, setSimUseCredit] = useState(true);

  const subsidyRate = simAge === '40plus' ? 0.7 : 0.5;
  const afterSubsidy = simCourseFee * (1 - subsidyRate);
  const maxCredit = simAge === '40plus' ? 4500 : 500;
  const creditOffset = simUseCredit ? Math.min(afterSubsidy, maxCredit) : 0;
  const cashOutlay = Math.max(0, afterSubsidy - creditOffset);

  const schemes: {
    title: string;
    schemeKey: FundingScheme;
    amount: string;
    eligibility: string;
    description: string;
    highlights: string[];
  }[] = [
    {
      title: 'SkillsFuture Credit (Opening & One-Off Top-Up)',
      schemeKey: 'SkillsFuture Credit',
      amount: '$500 – $1,000',
      eligibility: 'Singapore Citizens aged 25 and above',
      description:
        'Offset out-of-pocket course fees for approved SkillsFuture courses across polytechnics, universities, and WSQ providers.',
      highlights: [
        'Opening Credit of $500 never expires',
        'Claim directly up to 60 days prior to course start date',
      ],
    },
    {
      title: 'SkillsFuture Level-Up Programme (Mid-Career Credit)',
      schemeKey: 'Level-Up Mid-Career ($4,000)',
      amount: '$4,000 Top-Up',
      eligibility: 'Singapore Citizens aged 40 and above',
      description:
        'Substantial targeted top-up dedicated to courses with stronger employability outcomes, including SCTP, part-time diplomas, and Industry Transformation Map courses.',
      highlights: [
        'Usable alongside Mid-Career Enhanced Subsidy (up to 70–90% off)',
        'Training allowance available for full-time long-form programmes',
      ],
    },
    {
      title: 'SkillsFuture Career Transition Programme (SCTP)',
      schemeKey: 'Career Transition (SCTP)',
      amount: 'Up to 90% Subsidy',
      eligibility: 'Mid-career Singapore Citizens & PRs',
      description:
        'Train-and-place courses lasting 3 to 12 months delivered by CET Centres with career coaching and employer networking.',
      highlights: [
        'Includes industry capstone project and placement support',
        'Additional subsidy for long-term unemployed or lower-income learners',
      ],
    },
    {
      title: 'Workfare Skills Support (WSS)',
      schemeKey: 'Workfare Skills Support',
      amount: 'Up to 95% Subsidy',
      eligibility: 'Lower-wage Singapore Citizens aged 30+',
      description:
        'Encourages lower-wage workers to upgrade skills through higher course fee subsidies and training allowance payouts.',
      highlights: [
        'Covers WSQ modules and certifiable foundational skills',
        'Training allowance compensates hourly income during study',
      ],
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-[#C81058] mb-2">
            Grants, Subsidies &amp; Credits
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Apply for SkillsFuture Funding &amp; Subsidies
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Understand how government course fee subsidies stack with your
            SkillsFuture Credit balances before enrolling with a training provider.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSingpass}
          className="px-4 py-2.5 bg-[#1B2B5A] hover:bg-[#142045] text-white text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
        >
          {citizen
            ? `Viewing profile: ${citizen.name}`
            : 'Log in with Singpass to check balance'}
        </button>
      </div>

      {/* Funding Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((item) => (
          <article
            key={item.title}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
          >
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="text-xs font-medium text-slate-500">
                  {item.eligibility}
                </span>
                <span className="font-mono text-sm font-semibold text-[#C81058] tabular-nums shrink-0">
                  {item.amount}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {item.description}
              </p>
              <ul className="space-y-2">
                {item.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0F4C81] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onFilterByScheme(item.schemeKey);
                  onNavigate('directory');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2B5A] hover:text-[#C81058] transition-colors cursor-pointer"
              >
                <span>Browse eligible courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Fee & Credit Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <Calculator className="w-5 h-5 text-[#1B2B5A]" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Interactive Subsidy &amp; Credit Stacking Simulator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <label
                  htmlFor="sim-fee-slider"
                  className="font-medium text-slate-700"
                >
                  Full Course Fee (before subsidy)
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  ${simCourseFee.toLocaleString('en-SG')}.00
                </span>
              </div>
              <input
                id="sim-fee-slider"
                type="range"
                min={200}
                max={6000}
                step={100}
                value={simCourseFee}
                onChange={(e) => setSimCourseFee(Number(e.target.value))}
                className="w-full accent-[#C81058]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSimAge('40plus')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                  simAge === '40plus'
                    ? 'bg-[#1B2B5A] text-white border-[#1B2B5A]'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Singapore Citizen (40 &amp; above · 70%+ subsidy)
              </button>
              <button
                type="button"
                onClick={() => setSimAge('25to39')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                  simAge === '25to39'
                    ? 'bg-[#1B2B5A] text-white border-[#1B2B5A]'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Singapore Citizen (25 – 39 · 50% subsidy)
              </button>
            </div>

            <label className="inline-flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={simUseCredit}
                onChange={(e) => setSimUseCredit(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#C81058]"
              />
              <span>
                Apply available SkillsFuture Credit (up to $
                {maxCredit.toLocaleString('en-SG')})
              </span>
            </label>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Full fee</span>
              <span className="font-mono tabular-nums">
                ${simCourseFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>
                Baseline SSG subsidy ({Math.round(subsidyRate * 100)}%)
              </span>
              <span className="font-mono tabular-nums">
                −${(simCourseFee - afterSubsidy).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[#0F4C81]">
              <span>SkillsFuture Credit offset</span>
              <span className="font-mono tabular-nums">
                −${creditOffset.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-300 flex items-baseline justify-between">
              <span className="font-display font-bold text-slate-900">
                Est. Cash Out-of-Pocket
              </span>
              <span className="font-mono text-2xl font-bold text-[#1B2B5A] tabular-nums">
                ${cashOutlay.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
