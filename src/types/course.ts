export type ActiveSection = 'directory' | 'funding' | 'advice' | 'saved';

export type TrainingMode =
  | 'Classroom'
  | 'Blended'
  | 'Online Live'
  | 'Self-Paced E-Learning';

export type FundingScheme =
  | 'SkillsFuture Credit'
  | 'Level-Up Mid-Career ($4,000)'
  | 'Career Transition (SCTP)'
  | 'Workfare Skills Support';

export type SkillsCategory = 'Work & Career' | 'Hobbies & Personal';

export type CourseArea =
  | 'AI & Technology'
  | 'Data & Analytics'
  | 'Sustainability & Green Economy'
  | 'Business & Finance'
  | 'Food Safety & Hospitality'
  | 'Healthcare & Care Economy'
  | 'Lifestyle & Enrichment';

export type QualificationLevel =
  | 'No Formal Qualification'
  | 'Secondary / O-Level'
  | 'Diploma / ITE'
  | "Bachelor's Degree";

export type DurationBucket =
  | 'Under 16 hrs'
  | '16 – 40 hrs'
  | '40+ hrs';

export type SortOption =
  | 'best-match'
  | 'lowest-fee'
  | 'highest-rated'
  | 'shortest-duration'
  | 'earliest-date';

export type ResidencyTier =
  | 'sc-40-plus'
  | 'sc-under-40'
  | 'pr'
  | 'full-fee';

export interface CourseIntake {
  id: string;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  seatsLeft: number;
}

export interface Course {
  id: string;
  referenceCode: string;
  title: string;
  provider: string;
  providerShort: string;
  area: CourseArea;
  skillsCategory: SkillsCategory;
  mode: TrainingMode;
  durationHours: number;
  durationLabel: string;
  fullFee: number;
  subsidizedFeeSc40: number;
  subsidizedFeeScUnder40: number;
  subsidizedFeePr: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  schemes: FundingScheme[];
  minQualification: QualificationLevel;
  hasFixedStartDate: boolean;
  nextStartDateISO: string | null;
  nextStartDateDisplay: string;
  imageUrl: string;
  imageAlt: string;
  featuredTag?: 'Featured' | 'High Demand' | 'New';
  summary: string;
  learningOutcomes: string[];
  skillsCovered: string[];
  intakes: CourseIntake[];
  certificateType: string;
}

export interface FilterState {
  searchQuery: string;
  skillsCategory: SkillsCategory | 'all';
  areas: CourseArea[];
  schemes: FundingScheme[];
  modes: TrainingMode[];
  durationBuckets: DurationBucket[];
  providers: string[];
  minQualifications: QualificationLevel[];
  maxNetFee: number | null;
  showNoStartDate: boolean;
}

export interface CitizenProfile {
  id: string;
  name: string;
  nricMasked: string;
  ageGroup: '40 and above' | '25 to 39';
  residencyTier: ResidencyTier;
  openingCreditBalance: number;
  oneOffTopUpBalance: number;
  levelUpMidCareerBalance: number;
}
