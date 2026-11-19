import { useState } from 'react';
import { ChevronDown, Lock, Landmark } from 'lucide-react';

export function GovMasthead() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#F1F5F9] border-b border-slate-200 text-xs text-slate-700">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-[#C8102E] shrink-0"
          >
            <path
              d="M12 2L14.8 5.2L19 4.5L18.2 8.8L21.5 11.5L18 14L19 18.2L14.8 17.5L12 21L9.2 17.5L5 18.2L6 14L2.5 11.5L5.8 8.8L5 4.5L9.2 5.2L12 2Z"
              fill="currentColor"
              fillOpacity="0.16"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="11.5" r="3" fill="currentColor" />
          </svg>
          <span className="font-medium text-slate-800">
            A Singapore Government Agency Website
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1 text-[#0F4C81] hover:text-[#0B3961] underline underline-offset-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C81] cursor-pointer"
        >
          <span>How to identify</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-100/80">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#0F4C81]">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Official website links end with .gov.sg
                </p>
                <p className="leading-relaxed text-slate-600">
                  Government agencies communicate via{' '}
                  <span className="font-mono font-medium text-slate-800">.gov.sg</span>{' '}
                  websites (for example,{' '}
                  <span className="font-mono text-slate-800">
                    courses.myskillsfuture.gov.sg
                  </span>
                  ). Always verify the domain before entering Singpass credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#0F4C81]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Trusted websites are encrypted with HTTPS
                </p>
                <p className="leading-relaxed text-slate-600">
                  Look for the padlock icon or{' '}
                  <span className="font-mono font-medium text-slate-800">https://</span>{' '}
                  in your browser address bar, indicating your session and SkillsFuture
                  Credit details are transmitted over an encrypted connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
