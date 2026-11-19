import { useEffect } from 'react';
import { X, ShieldCheck, LogOut, UserCheck } from 'lucide-react';
import { CITIZEN_PROFILES } from '../data/courses';
import { CitizenProfile } from '../types/course';

interface SingpassModalProps {
  open: boolean;
  currentCitizen: CitizenProfile | null;
  onSelectCitizen: (profile: CitizenProfile | null) => void;
  onClose: () => void;
}

export function SingpassModal({
  open,
  currentCitizen,
  onSelectCitizen,
  onClose,
}: SingpassModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="singpass-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#F4333D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h2
              id="singpass-modal-title"
              className="font-display text-base font-bold tracking-tight"
            >
              Singpass Citizen Profile Preview
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Singpass login"
            className="p-1.5 rounded-lg text-white/90 hover:bg-white/15 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select a sample Singapore Citizen profile below to preview real-time
            SkillsFuture Credit balances and age-based subsidy rates across all
            courses.
          </p>

          <div className="space-y-3">
            {CITIZEN_PROFILES.map((profile) => {
              const isSelected = currentCitizen?.id === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => {
                    onSelectCitizen(profile);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#1B2B5A] bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#1B2B5A]" />
                      {profile.name}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {profile.nricMasked}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Singapore Citizen · Age {profile.ageGroup}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">
                        Opening + Top-up
                      </span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        $
                        {(
                          profile.openingCreditBalance +
                          profile.oneOffTopUpBalance
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">
                        Level-Up (40+)
                      </span>
                      <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                        ${profile.levelUpMidCareerBalance.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {currentCitizen && (
            <button
              type="button"
              onClick={() => {
                onSelectCitizen(null);
                onClose();
              }}
              className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out of citizen preview</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
