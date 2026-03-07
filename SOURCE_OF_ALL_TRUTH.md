# Source of All Truth

This document serves as the central reference for the technical architecture, dependencies, workflows, and key code patterns of the **Hopechest Picker** application. It is a living document and will be updated as the application evolves.

---

## 1. Tech Stack & Core Dependencies

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.1.1 |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS v4 | ^4 |
| Database | Supabase (PostgreSQL) | ^2.90.1 |
| Email | Resend + @react-email/components | ^6.7.0 / ^1.0.4 |
| Language | TypeScript | ^5 |

**Fonts:**
- `Open Sans` — body font (via `next/font/google`)
- `Have Heart` — brand script font (local OTF at `public/fonts/HaveHeart.otf`)

**Environment Variables Required:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
RESEND_API_KEY
EMAIL_FROM          # e.g. noreply@missionvox.ai
INTERNAL_EMAIL_TO   # e.g. tim@missionvox.ai
NEXT_PUBLIC_BASE_URL
```

---

## 2. Project Structure

```
hopechest-picker/
├── app/
│   ├── layout.tsx                     # Root layout, fonts, metadata, OG tags
│   ├── page.tsx                       # Landing page + wizard orchestration
│   ├── globals.css                    # Global Tailwind styles
│   └── api/
│       └── save-fit-guide/
│           └── route.ts               # POST API: saves to Supabase + sends emails
├── src/
│   ├── components/
│   │   ├── Wizard.tsx                 # 5-step modal wizard (lead capture + scoring inputs)
│   │   ├── Results.tsx                # Results page: top 3 country cards + CTA
│   │   ├── FeaturedCountryCard.tsx    # Full-width #1 match card with personalized sections
│   │   └── CountryCard.tsx           # Compact card (used for #2 and #3 matches)
│   ├── lib/
│   │   ├── scoring.ts                 # Core scoring engine (calculateCountryScores)
│   │   ├── personalization.ts         # Generates personalized sections for FeaturedCountryCard
│   │   ├── api.ts                     # Client-side fetch wrapper (saveFitGuide)
│   │   ├── supabase.ts               # Supabase client singleton
│   │   └── resend.ts                  # Resend client singleton
│   ├── emails/
│   │   ├── InternalAlert.tsx          # Email to HopeChest team on new submission
│   │   └── PastorResults.tsx          # Confirmation email to pastor/contact
│   ├── data/
│   │   └── countries.ts               # Static country data + 2026 vision trip schedule
│   └── types/
│       ├── wizard.ts                  # WizardState, CountryScore, ScoringResult types
│       └── index.ts                   # Country, VisionTrip types
└── public/
    ├── images/                        # Country hero images, excursion photos
    ├── fonts/HaveHeart.otf
    └── hopechest-logo.png
```

---

## 3. Application Flow

```
Landing Page (page.tsx)
  └── "Start Your Journey" button
        └── Opens <Wizard> modal
              └── 5 steps → onComplete(wizardAnswers)
                    └── calculateCountryScores(answers)  [scoring.ts]
                          └── scoringResults returned
                                └── <Results> rendered
                                      └── useEffect → saveFitGuide() [api.ts]
                                            └── POST /api/save-fit-guide
                                                  ├── INSERT into fit_guides (Supabase)
                                                  ├── Send InternalAlert email (Resend)
                                                  └── Send PastorResults email (Resend)
```

---

## 4. Wizard Steps (`src/components/Wizard.tsx`)

| Step | Screen | Required? | Key Fields |
|---|---|---|---|
| 1 | Identity / Lead Capture | All required | `churchName`, `denomination`, `contactName`, `contactRole`, `email` |
| 2 | Church Size + Global Footprint | `attendance` required | `attendance`, `globalPresenceStatus`, `regionPreference`, `existingRegions` |
| 3 | Constraints (Sliders) | Auto-filled | `costImportance`, `timeAwayImportance`, `englishImportance` (low/medium/high) |
| 4 | Mobilization | Optional (up to 4) | `mobilization[]`, `mobilizationOther` |
| 5 | Impact DNA | At least 1 required | `impactDNA[]`, `frontierType` |

**Slider → ImportanceLevel conversion** (`Wizard.tsx:69`):
```ts
const sliderToImportance = (value: number): ImportanceLevel => {
  if (value <= 33) return 'low';
  if (value <= 66) return 'medium';
  return 'high';
};
```

**Wizard completion** calls `onComplete(wizardState)` back to `page.tsx`, which calls `calculateCountryScores()` and sets state — no server call at this point.

---

## 5. Scoring Engine (`src/lib/scoring.ts`)

**Countries scored:** Guatemala, Uganda, Ethiopia (base score: 50 each)

### Scoring Rules Summary

| Signal | Condition | Effect |
|---|---|---|
| Attendance | 0–50 or 50–125 | +20 Guatemala |
| Attendance | 125–300 | +18 Guatemala |
| Attendance | 300–500 | +10 Guatemala |
| Global presence = "different_region" | — | +8 Uganda, +8 Ethiopia |
| Existing regions include Latin America | + wants different region | -50 Guatemala, +6 Uganda/Ethiopia |
| Existing regions include Africa | + wants different region | -50 Uganda/Ethiopia, +10 Guatemala |
| Cost importance = high | — | +30 Guatemala |
| Cost importance = medium | — | +15 Guatemala |
| Time importance = high | — | +25 Guatemala, +10 Ethiopia, -5 Uganda |
| Time importance = medium | — | +12 Guatemala, +6 Ethiopia, -3 Uganda |
| English importance = high | — | +30 Uganda |
| English importance = medium | — | +15 Uganda |
| Impact DNA = frontier | minimal_infrastructure | +15 Uganda, +10 Ethiopia; +10 more Uganda |
| Impact DNA = frontier | muslim_majority | +15 Uganda, +10 Ethiopia; +10 more Ethiopia |
| Impact DNA = church_planting | — | +8 Uganda/Ethiopia, +3 Guatemala |

**Score normalization** (`scoring.ts:113`): Top country is always set to 100. Others are scaled proportionally in the 85–100 range.

**Confidence calculation** (`scoring.ts:565`): Starts at 100, deducts for "not_sure" answers and all-medium sliders.
- >= 80 → `high`
- >= 55 → `medium`
- < 55 → `low`

---

## 6. Types (`src/types/wizard.ts`, `src/types/index.ts`)

```ts
interface WizardState {
  // Step 1
  churchName: string;
  denomination: string;
  contactName: string;
  contactRole: string;
  email: string;
  // Step 2
  attendance: AttendanceRange;           // '0-50' | '50-125' | '125-300' | '300-500' | '500-1000' | '1000-2000' | '2000+'
  globalPresenceStatus: GlobalPresenceStatus; // 'no' | 'yes' | 'not_sure'
  regionPreference?: RegionPreference;   // 'complement_existing' | 'different_region' | 'not_sure'
  existingRegions?: string;
  // Step 3
  costImportance: ImportanceLevel;       // 'low' | 'medium' | 'high'
  timeAwayImportance: ImportanceLevel;
  englishImportance: ImportanceLevel;
  // Step 4
  partnershipPosture?: PartnershipPosture; // 'own_community' | 'partner_with_others' | 'flexible' | 'not_sure'
  mobilization?: MobilizationOption[];
  mobilizationOther?: string;
  // Step 5
  impactDNA?: ImpactDNA[];
  frontierType?: FrontierType;           // 'minimal_infrastructure' | 'muslim_majority_context' | 'not_sure'
  otherFactors?: string;
}

interface ScoringResult {
  top3: CountryScore[];
  allScores: Record<string, number>;
  confidence: 'high' | 'medium' | 'low';
}

interface CountryScore {
  country: string;
  score: number;
  reasons: string[];
}
```

---

## 7. API Route (`app/api/save-fit-guide/route.ts`)

**Endpoint:** `POST /api/save-fit-guide`

**Supabase table:** `fit_guides`

**Key columns saved:**
```
church_name, denomination, contact_name, contact_role, contact_email,
attendance_range, global_presence_status, global_presence_regions, region_preference,
sliders (JSONB: { cost, timeAway, english }),
partnership_posture, mobilization, mobilization_other,
impact_dna (JSONB), frontier_type, other_factors,
scores (JSONB: Record<string, number>),
top3 (JSONB: Array<{ country, score, reasons }>),
confidence_level
```

**Emails sent (via Resend):**
1. `InternalAlert` → `INTERNAL_EMAIL_TO` — Subject: `New Vision Trip Lead: {churchName}`
2. `PastorResults` → `wizardState.email` — Subject: `Your HopeChest Partnership Guide`

Email failures are caught and logged but do NOT fail the overall request — user always sees success if the DB save worked.

---

## 8. Country Data (`src/data/countries.ts` + `src/components/Results.tsx`)

**Active scoring countries (Big 3):** Guatemala, Uganda, Ethiopia

**2026 Vision Trip URLs follow the pattern:**
```
https://www.hopechest.org/vision-trips/{country-code}-{mon}{year}/
e.g. gt-feb26, ug-apr26, et-may26
```

**Country details are stored inline in `Results.tsx` (`COUNTRY_DATA` object)** — this is the source for images, about text, programs, considerations, excursions, duration, cost range, and language shown on the results page.

---

## 9. Personalization Engine (`src/lib/personalization.ts`)

Generates `PersonalizedSection[]` for the featured (#1) country card based on `WizardState`. Sections are generated for:
- `education_medical` → Education & Schools Partnership + Medical & Healthcare Ministry
- `community_transformation` → Holistic Community Transformation
- `frontier_hard_to_reach` → Reaching Vulnerable Communities
- `friendship_model` → The Friendship Model (shared across all countries)
- `carepoint_graduation` → CarePoint Graduation (shared across all countries)
- `mobilization[]` → Mobilizing Your Team (country + role specific)
- `partnershipPosture` → Own CarePoint vs. Collaborative Partnership

---

## 10. Tailwind Brand Colors (defined in CSS/Tailwind config)

| Class | Usage |
|---|---|
| `bg-brand-teal` | Primary brand color (buttons, headings, accents) |
| `bg-brand-teal-dark` | Hover state for teal elements |
| `bg-brand-teal-light` | Lighter teal (borders, inactive progress) |
| `bg-brand-teal-bg` | Very light teal background (highlight boxes) |
| `bg-brand-tan` | CTA button color (yellow-tan) |
| `bg-brand-orange` | Register buttons, Next button |
| `bg-brand-brown` | Hover for orange, text on tan buttons |
| `font-brand` | Have Heart script font |
| `font-sans` | Open Sans body font |
