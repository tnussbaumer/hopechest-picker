/**
 * Type definitions for the HopeChest Vision Trip Fit Guide Wizard
 */

export type AttendanceRange = 
  | '0-50'
  | '50-125'
  | '125-300'
  | '300-500'
  | '500-1000'
  | '1000-2000'
  | '2000+';

export type GlobalPresenceStatus = 'no' | 'yes' | 'not_sure';

export type RegionPreference = 'complement_existing' | 'different_region' | 'not_sure';

export type PartnershipPosture = 'own_community' | 'partner_with_others' | 'flexible' | 'not_sure';

export type MobilizationOption =
  | 'students_young_adults'
  | 'families_with_children'
  | 'teachers_educators'
  | 'medical_professionals'
  | 'adults_seniors'
  | 'broad_church_wide'
  | 'small_groups_sunday_school'
  | 'construction_teams'
  | 'other';

export type ImpactDNA =
  | 'evangelism_discipleship'
  | 'education_medical'
  | 'church_planting'
  | 'community_transformation'
  | 'frontier_hard_to_reach'
  | 'youth_development_leadership'
  | 'friendship_model'
  | 'carepoint_graduation';

export type FrontierType =
  | 'minimal_infrastructure'
  | 'muslim_majority_context'
  | 'not_sure';

export type ImportanceLevel = 'low' | 'medium' | 'high';

export interface WizardState {
  // Screen 1 - Identity (Lead Capture)
  churchName: string;
  denomination: string;
  contactName: string;
  contactRole: string;
  email: string;

  // Screen 2 - Size + Global Footprint
  attendance: AttendanceRange;
  globalPresenceStatus: GlobalPresenceStatus;
  regionPreference?: RegionPreference; // Only if globalPresenceStatus === 'yes'
  existingRegions?: string; // Optional text field if they have presence

  // Screen 3 - Constraints (Sliders)
  costImportance: ImportanceLevel;
  timeAwayImportance: ImportanceLevel;
  englishImportance: ImportanceLevel;

  // Screen 4 - Partnership Posture (future)
  partnershipPosture?: PartnershipPosture;

  // Screen 5 - Mobilization (future)
  mobilization?: MobilizationOption[];
  mobilizationOther?: string; // Custom text when 'other' is selected

  // Screen 6 - Impact DNA (future) - now supports multiple selections
  impactDNA?: ImpactDNA[];
  frontierType?: FrontierType;

  // Screen 7 - Other Factors (future)
  otherFactors?: string;
}

export interface CountryScore {
  country: string;
  score: number;
  reasons: string[];
}

export interface ScoringResult {
  top3: CountryScore[];
  allScores: Record<string, number>;
  confidence: 'high' | 'medium' | 'low';
}
