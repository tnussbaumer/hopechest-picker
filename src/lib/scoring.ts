/**
 * HopeChest Vision Trip Fit Guide - Scoring Engine
 * Implements the exact scoring logic from the blueprint
 */

import { WizardState, CountryScore, ScoringResult, ImportanceLevel } from '../types/wizard';

// Base scores for the Big 3 countries
const BASE_SCORES: Record<string, number> = {
  Guatemala: 50,
  Uganda: 50,
  Ethiopia: 50,
};

// Travel facts for generating reasons
const TRAVEL_FACTS = {
  Guatemala: {
    days: '5–6',
    cost: '$1,500–$2,200',
    notes: [
      'Often the most accessible first trip (shorter + lower cost)',
      'Great option for broad church-wide involvement',
      'Strong fit for Spanish speakers / immersion',
    ],
  },
  Uganda: {
    days: '10',
    cost: '$1,800–$2,750',
    notes: [
      'English is widely spoken',
      'Often requires more flight connections (more travel time/cost)',
      'Strong frontier / hard-to-reach context; need can be especially high',
    ],
  },
  Ethiopia: {
    days: '10',
    cost: '$1,800–$2,750',
    notes: [
      'Direct flights available from select U.S. cities can reduce travel friction',
      'Christian-majority context with meaningful Muslim-area ministry opportunities',
    ],
  },
};

/**
 * Calculate country scores based on wizard answers
 */
export function calculateCountryScores(answers: WizardState): ScoringResult {
  // Initialize scores with base values
  const scores: Record<string, number> = { ...BASE_SCORES };
  const reasons: Record<string, string[]> = {
    Guatemala: [],
    Uganda: [],
    Ethiopia: [],
  };

  // 1. ATTENDANCE SCORING
  applyAttendanceScoring(answers.attendance, scores, reasons);

  // 2. GLOBAL PRESENCE SCORING
  if (answers.globalPresenceStatus) {
    applyGlobalPresenceScoring(
      answers.globalPresenceStatus,
      answers.regionPreference,
      answers.existingRegions,
      scores,
      reasons
    );
  }

  // 3. SLIDER SCORING (Cost, Time, English)
  applyCostScoring(answers.costImportance, scores, reasons);
  applyTimeScoring(answers.timeAwayImportance, scores, reasons);
  applyEnglishScoring(answers.englishImportance, scores, reasons);

  // 4. PARTNERSHIP POSTURE (future - Phase 2)
  if (answers.partnershipPosture) {
    applyPartnershipScoring(answers.partnershipPosture, scores, reasons);
  }

  // 5. MOBILIZATION & SPANISH TOGGLE (future - Phase 2)
  if (answers.mobilization) {
    applyMobilizationScoring(answers.mobilization, scores, reasons);
  }
  if (answers.spanishToggle) {
    scores.Guatemala += 5;
    reasons.Guatemala.push('Your Spanish speakers will thrive here');
  }

  // 6. IMPACT DNA & FRONTIER (future - Phase 2) - now supports multiple selections
  if (answers.impactDNA && answers.impactDNA.length > 0) {
    answers.impactDNA.forEach((dna) => {
      applyImpactDNAScoring(dna, answers.frontierType, scores, reasons);
    });
  }

  // 6b. ADD ADDITIONAL CONTEXTUAL REASONS to ensure minimum 6 bullet points
  addContextualReasons(answers, scores, reasons);

  // 7. TIE-BREAKING LOGIC
  applyTieBreaking(scores, answers);

  // 8. SORT AND GET TOP 3
  const sortedCountries = Object.entries(scores)
    .map(([country, score]) => ({
      country,
      score,
      reasons: reasons[country] || [],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 8b. NORMALIZE TOP SCORE TO 85-100% RANGE
  if (sortedCountries.length > 0) {
    const topScore = sortedCountries[0].score;
    const minScore = Math.min(...sortedCountries.map(c => c.score));
    const maxScore = Math.max(...sortedCountries.map(c => c.score));
    
    // Normalize the #1 choice to be between 85-100
    // Other choices will scale proportionally
    sortedCountries.forEach((country, index) => {
      if (index === 0) {
        // Top choice: map to 85-100 range
        country.score = 100;
      } else {
        // Other choices: scale proportionally (maintaining relative differences)
        const ratio = country.score / topScore;
        country.score = Math.round(85 + (ratio * 15)); // Will be 85-100 range
      }
    });
  }

  // 9. CALCULATE CONFIDENCE
  const confidence = calculateConfidence(answers, sortedCountries);

  return {
    top3: sortedCountries,
    allScores: scores,
    confidence,
  };
}

/**
 * Attendance-based scoring
 */
function applyAttendanceScoring(
  attendance: string,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  switch (attendance) {
    case '0-50':
    case '50-125':
      scores.Guatemala += 20;
      reasons.Guatemala.push('Perfect size for an intimate, accessible first trip');
      break;
    case '125-300':
      scores.Guatemala += 18;
      reasons.Guatemala.push('Great fit for your church size');
      break;
    case '300-500':
      scores.Guatemala += 10;
      reasons.Guatemala.push('Accessible option for mid-size churches');
      break;
    // Larger churches don't get attendance bonuses - all countries are viable
  }
}

/**
 * Global presence scoring
 */
function applyGlobalPresenceScoring(
  status: string,
  preference: string | undefined,
  existingRegions: string | undefined,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (status === 'not_sure') {
    scores.Guatemala += 2;
    scores.Uganda += 2;
    scores.Ethiopia += 2;
    return;
  }

  if (status === 'yes' && preference) {
    if (preference === 'different_region') {
      scores.Uganda += 8;
      scores.Ethiopia += 8;
      reasons.Uganda.push('Expands your global footprint to a new region');
      reasons.Ethiopia.push('Expands your global footprint to a new region');

      // ANTI-PREFERENCE LOGIC: Heavily penalize regions they already work in
      if (existingRegions) {
        const regions = existingRegions.toLowerCase();
        
        // If they work in Latin America/Guatemala and want different region
        // -> SUBTRACT 50 from Guatemala (anti-preference)
        if (
          regions.includes('latin') ||
          regions.includes('central america') ||
          regions.includes('south america') ||
          regions.includes('mexico') ||
          regions.includes('honduras') ||
          regions.includes('guatemala')
        ) {
          scores.Guatemala -= 50;
          scores.Uganda += 6;
          scores.Ethiopia += 6;
          reasons.Uganda.push('Complements your Latin America work with African context');
          reasons.Ethiopia.push('Complements your Latin America work with African context');
        }
        
        // If they work in Africa and want different region
        // -> SUBTRACT 50 from Uganda and Ethiopia (anti-preference)
        if (
          regions.includes('africa') ||
          regions.includes('kenya') ||
          regions.includes('uganda') ||
          regions.includes('ethiopia')
        ) {
          scores.Uganda -= 50;
          scores.Ethiopia -= 50;
          scores.Guatemala += 10;
          reasons.Guatemala.push('Adds Central America to your Africa partnerships');
        }
      }
    } else if (preference === 'not_sure') {
      scores.Guatemala += 3;
    }
  }
}

/**
 * Cost importance scoring
 */
function applyCostScoring(
  importance: ImportanceLevel,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (importance === 'high') {
    scores.Guatemala += 30;
    reasons.Guatemala.push('Most budget-friendly option ($1,500–$2,200 per person)');
  } else if (importance === 'medium') {
    scores.Guatemala += 15;
    reasons.Guatemala.push('Lower trip costs make this more accessible');
  }
}

/**
 * Time away importance scoring
 */
function applyTimeScoring(
  importance: ImportanceLevel,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (importance === 'high') {
    scores.Guatemala += 25;
    scores.Ethiopia += 10;
    scores.Uganda -= 5;
    reasons.Guatemala.push('Shortest trip duration (5–6 days total)');
    reasons.Ethiopia.push('Direct flights available reduce total travel time');
  } else if (importance === 'medium') {
    scores.Guatemala += 12;
    scores.Ethiopia += 6;
    scores.Uganda -= 3;
    reasons.Guatemala.push('Shorter time commitment works well for busy schedules');
    reasons.Ethiopia.push('More efficient travel than other African options');
  }
}

/**
 * English importance scoring
 */
function applyEnglishScoring(
  importance: ImportanceLevel,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (importance === 'high') {
    scores.Uganda += 30;
    reasons.Uganda.push('English is widely spoken—easy communication');
  } else if (importance === 'medium') {
    scores.Uganda += 15;
    reasons.Uganda.push('English fluency makes connection easier');
  }
}

/**
 * Partnership posture scoring (Phase 2)
 */
function applyPartnershipScoring(
  posture: string,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (posture === 'partner_with_others') {
    scores.Uganda += 8;
    scores.Ethiopia += 8;
    reasons.Uganda.push('Strong collaborative opportunities available');
    reasons.Ethiopia.push('Strong collaborative opportunities available');
  } else if (posture === 'flexible') {
    // Flexible gives small boost to all countries - shows openness
    scores.Guatemala += 3;
    scores.Uganda += 3;
    scores.Ethiopia += 3;
  } else if (posture === 'not_sure') {
    scores.Guatemala += 4;
  }
}

/**
 * Mobilization scoring (Phase 2)
 */
function applyMobilizationScoring(
  mobilization: string[],
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  mobilization.forEach((option) => {
    if (option === 'adults_seniors') {
      scores.Guatemala += 2;
    } else if (option === 'broad_church_wide') {
      scores.Guatemala += 3;
      reasons.Guatemala.push('Excellent for engaging your whole church');
    } else {
      // Most mobilization options benefit all countries
      scores.Guatemala += 2;
      scores.Uganda += 2;
      scores.Ethiopia += 2;
    }
  });
}

/**
 * Impact DNA scoring (Phase 2)
 */
function applyImpactDNAScoring(
  dna: string,
  frontierType: string | undefined,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  if (dna === 'frontier_hard_to_reach') {
    scores.Uganda += 15;
    scores.Ethiopia += 10;
    reasons.Uganda.push('High-need frontier context with minimal existing infrastructure');
    reasons.Ethiopia.push('Meaningful frontier ministry opportunities');

    if (frontierType === 'minimal_infrastructure') {
      scores.Uganda += 10;
      reasons.Uganda.push('Remote communities with significant need');
    } else if (frontierType === 'muslim_majority_context') {
      scores.Ethiopia += 10;
      reasons.Ethiopia.push('CarePoints serving Muslim-majority communities');
    } else if (frontierType === 'not_sure') {
      scores.Uganda += 2;
      scores.Ethiopia += 2;
    }
  } else if (dna === 'church_leadership') {
    scores.Uganda += 5;
    scores.Ethiopia += 5;
    reasons.Uganda.push('Strong leadership development opportunities');
    reasons.Ethiopia.push('Partner with local church leaders');
  } else {
    // Education, health, community transformation benefit all
    scores.Guatemala += 5;
    scores.Uganda += 5;
    scores.Ethiopia += 5;
  }
}

/**
 * Add contextual reasons to ensure minimum 6 bullet points
 */
function addContextualReasons(
  answers: WizardState,
  scores: Record<string, number>,
  reasons: Record<string, string[]>
) {
  // Sort to find which country has highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topCountry = sorted[0][0];
  
  // Add contextual reasons based on user selections until we have at least 6
  const currentReasons = reasons[topCountry] || [];
  
  // Add partnership-related reasons
  if (currentReasons.length < 6 && answers.partnershipPosture === 'own_community') {
    if (topCountry === 'Guatemala') {
      reasons.Guatemala.push('Build deep, long-term relationships with your own community');
    } else if (topCountry === 'Uganda') {
      reasons.Uganda.push('Own a transformational partnership with lasting impact');
    } else if (topCountry === 'Ethiopia') {
      reasons.Ethiopia.push('Establish multi-year relationships that change generations');
    }
  }
  
  // Add Impact DNA related concise reasons
  if (currentReasons.length < 6 && answers.impactDNA && answers.impactDNA.length > 0) {
    if (answers.impactDNA.includes('friendship_model')) {
      reasons[topCountry].push('Dignity-based relationships honor community leadership');
    }
    if (currentReasons.length < 6 && answers.impactDNA.includes('carepoint_graduation')) {
      reasons[topCountry].push('Sustainable model designed for community independence');
    }
    if (currentReasons.length < 6 && answers.impactDNA.includes('community_transformation')) {
      reasons[topCountry].push('Holistic approach addresses root causes, not just symptoms');
    }
    if (currentReasons.length < 6 && answers.impactDNA.includes('education_schools')) {
      reasons[topCountry].push('Education programs create lasting generational change');
    }
    if (currentReasons.length < 6 && answers.impactDNA.includes('youth_development_leadership')) {
      reasons[topCountry].push('Youth leadership development multiplies long-term impact');
    }
  }
  
  // Add mobilization-specific reasons if we still need more
  if (currentReasons.length < 6 && answers.mobilization && answers.mobilization.length > 0) {
    if (answers.mobilization.includes('families_with_children')) {
      reasons[topCountry].push('Family-friendly environment for meaningful intergenerational impact');
    }
    if (currentReasons.length < 6 && answers.mobilization.includes('construction_teams')) {
      reasons[topCountry].push('Hands-on construction projects create visible, lasting infrastructure');
    }
    if (currentReasons.length < 6 && answers.mobilization.includes('medical_professionals')) {
      reasons[topCountry].push('Critical healthcare needs where your medical expertise makes real difference');
    }
  }
  
  // General country-specific reasons as fallback
  if (currentReasons.length < 6) {
    if (topCountry === 'Guatemala') {
      reasons.Guatemala.push('Proven track record of successful church partnerships');
    } else if (topCountry === 'Uganda') {
      reasons.Uganda.push('High community need creates profound ministry opportunities');
    } else if (topCountry === 'Ethiopia') {
      reasons.Ethiopia.push('Rich cultural heritage enhances cross-cultural learning');
    }
  }
}

/**
 * Tie-breaking logic when scores are close
 */
function applyTieBreaking(scores: Record<string, number>, answers: WizardState) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  if (sorted.length >= 2) {
    const diff = sorted[0][1] - sorted[1][1];
    
    if (diff <= 5) {
      const top1 = sorted[0][0];
      const top2 = sorted[1][0];
      
      // English importance favors Uganda over Ethiopia
      if (
        (top1 === 'Ethiopia' && top2 === 'Uganda' || top1 === 'Uganda' && top2 === 'Ethiopia') &&
        (answers.englishImportance === 'high' || answers.englishImportance === 'medium')
      ) {
        if (top2 === 'Uganda') {
          scores.Uganda += 3;
        }
      }
      
      // Time/cost favors Ethiopia over Uganda
      if (
        (top1 === 'Ethiopia' && top2 === 'Uganda' || top1 === 'Uganda' && top2 === 'Ethiopia') &&
        (answers.timeAwayImportance === 'high' || answers.timeAwayImportance === 'medium')
      ) {
        if (top2 === 'Ethiopia') {
          scores.Ethiopia += 3;
        }
      }
      
      // Spanish toggle favors Guatemala when it's in top 2
      if (answers.spanishToggle && (top1 === 'Guatemala' || top2 === 'Guatemala')) {
        scores.Guatemala += 3;
      }
    }
  }
}

/**
 * Calculate confidence level
 */
function calculateConfidence(
  answers: WizardState,
  top3: CountryScore[]
): 'high' | 'medium' | 'low' {
  let confidence = 100;

  // Deduct for "not sure" answers
  if (answers.globalPresenceStatus === 'not_sure') confidence -= 10;
  if (answers.regionPreference === 'not_sure') confidence -= 10;
  if (answers.partnershipPosture === 'not_sure') confidence -= 10;

  // Deduct if all sliders are middling
  const allMedium =
    answers.costImportance === 'medium' &&
    answers.timeAwayImportance === 'medium' &&
    answers.englishImportance === 'medium';
  if (allMedium) confidence -= 15;

  // Deduct if top 1 and top 2 are very close
  if (top3.length >= 2 && top3[0].score - top3[1].score <= 5) {
    confidence -= 10;
  }

  if (confidence >= 80) return 'high';
  if (confidence >= 55) return 'medium';
  return 'low';
}
