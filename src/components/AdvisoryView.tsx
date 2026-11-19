import { ArrowRight, Compass, BookOpen, Briefcase } from 'lucide-react';
import { ActiveSection, CourseArea } from '../types/course';

interface AdvisoryViewProps {
  onSelectArea: (area: CourseArea) => void;
  onNavigate: (section: ActiveSection) => void;
}

export function AdvisoryView({ onSelectArea, onNavigate }: AdvisoryViewProps) {
  const pathways: {
    area: CourseArea;
    title: string;
    roles: string;
    horizon: string;
    guidance: string;
  }[] = [
    {
      area: 'AI & Technology',
      title: 'Artificial Intelligence, Cloud & Cyber Defence',
      roles: 'AI Engineer · Cloud Operations Specialist · SOC Analyst',
      horizon: 'High-demand Digital Economy skills',
      guidance:
        'Start with Python or Generative AI engineering modules if you already work in tech, or take a 12-week SCTP track to pivot from operations into cybersecurity.',
    },
    {
      area: 'Sustainability & Green Economy',
      title: 'Green Economy, ESG Reporting & Energy Efficiency',
      roles: 'ESG Analyst · Sustainability Manager · Energy Auditor',
      horizon: 'Singapore Green Plan 2030 priority',
      guidance:
        'Build practical fluency in Scope 1–3 carbon accounting, ISSB S1/S2 climate disclosures, and BCA Green Mark facility audits across built environment sectors.',
    },
    {
      area: 'Data & Analytics',
      title: 'Business Intelligence, SQL & Predictive Analytics',
      roles: 'Data Analyst · Operations Planner · BI Specialist',
      horizon: 'Cross-industry core digital fluency',
      guidance:
        'Ideal for finance, supply chain, HR, and marketing professionals replacing manual spreadsheet workflows with automated Python and SQL pipelines.',
    },
    {
      area: 'Healthcare & Care Economy',
      title: 'Allied Health Support & Community Care Coordination',
      roles: 'Care Coordinator · Senior Support Associate',
      horizon: 'Growing Care Economy demand',
      guidance:
        'Structured WSQ modules designed for compassionate mid-career entrants seeking stable, meaningful roles across acute and community care networks.',
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="pb-6 border-b border-slate-200">
        <p className="text-xs font-semibold text-[#C81058] mb-2">
          Career &amp; Skills Advisory
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
          Choose a Guided Learning Pathway
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Align your upskilling plan with Singapore&apos;s Industry Transformation
          Maps and explore curated course pathways tailored to emerging job roles.
        </p>
      </div>

      {/* 3 Advisory Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <Compass className="w-5 h-5 text-[#1B2B5A] mb-3" />
          <h2 className="font-display text-base font-bold text-slate-900 mb-1.5">
            01. Identify Skill Gaps
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Compare your current role competencies against SkillsFuture Skills
            Frameworks for Digital, Green, and Care economy tracks.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <BookOpen className="w-5 h-5 text-[#1B2B5A] mb-3" />
          <h2 className="font-display text-base font-bold text-slate-900 mb-1.5">
            02. Stack Modular Certificates
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Begin with 2-day WSQ or polytechnic short courses before committing
            your $4,000 Level-Up credit to longer specialist certificates.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <Briefcase className="w-5 h-5 text-[#1B2B5A] mb-3" />
          <h2 className="font-display text-base font-bold text-slate-900 mb-1.5">
            03. Connect to Career Transition
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Mid-career switchers can tap into SkillsFuture Career Transition
            Programmes (SCTP) paired with career advisory and placement support.
          </p>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pathways.map((p) => (
          <article
            key={p.title}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
          >
            <div>
              <p className="text-xs font-medium text-[#0F4C81] mb-1">
                {p.horizon}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Target roles: {p.roles}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {p.guidance}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onSelectArea(p.area);
                  onNavigate('directory');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2B5A] hover:text-[#C81058] transition-colors cursor-pointer"
              >
                <span>Explore {p.area} courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
