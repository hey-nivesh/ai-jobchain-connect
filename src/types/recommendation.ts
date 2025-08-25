export interface UserPreferences {
  desiredJobType: any;
  currentLocation: any;
  // Explicit preferences from profile
  skills: string[];
  experience_level: string;
  total_experience_years: number;
  location: string;
  job_type: string;
  salary_range: [number, number];
  remote_work: boolean;
  benefits: string[];
  industry: string;
  search_term?: string;

  // Implicit preferences (from user behavior)
  viewed_jobs?: string[];
  saved_jobs?: string[];
  applied_jobs?: string[];
}

export interface JobRecommendation {
  id: number;
  title: string;
  company: string;
  description: string;
  match_score: number;
  reasons_for_match: string[];
  salary?: string;
  location?: string;
  job_type?: string;
  posted_date?: string;
  employer_name?: string;
}
