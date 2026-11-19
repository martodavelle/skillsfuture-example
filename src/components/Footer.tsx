import { ActiveSection } from '../types/course';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
  onSelectTopic: (topic: string) => void;
}

export function Footer({ onNavigate, onSelectTopic }: FooterProps) {
  return (
    <footer className="bg-[#111C3D] text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="md:col-span-2">
            <p className="font-display text-lg font-bold text-white tracking-tight mb-2">
              MySkillsFuture Course Directory
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Singapore&apos;s national lifelong learning portal helping citizens and
              residents discover SkillsFuture Credit-eligible courses, compare
              subsidies, and plan meaningful career transitions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Portal Sections
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('directory')}
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  Find courses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('funding')}
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  Apply for funding
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('advice')}
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  Seek career advice
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('saved')}
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  Saved courses
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Popular Focus Areas
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                'Artificial Intelligence',
                'Data Analytics',
                'Sustainability',
                'Food Safety',
              ].map((topic) => (
                <li key={topic}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopic(topic);
                      onNavigate('directory');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-300 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                  >
                    {topic}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>SkillsFuture Singapore</span>
            <span aria-hidden="true">·</span>
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('funding');
              }}
              className="hover:text-white transition-colors"
            >
              Privacy Statement
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('funding');
              }}
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="#vulnerability"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('advice');
              }}
              className="hover:text-white transition-colors"
            >
              Report Vulnerability
            </a>
          </div>
          <p className="tabular-nums">
            © 2026 MySkillsFuture Directory Interface
          </p>
        </div>
      </div>
    </footer>
  );
}
