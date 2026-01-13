'use client';

import { useState } from 'react';
import { WizardState, AttendanceRange, GlobalPresenceStatus, RegionPreference, ImportanceLevel, PartnershipPosture, MobilizationOption, ImpactDNA, FrontierType } from '../types/wizard';

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: WizardState) => void;
}

const DENOMINATIONS = [
  'Non-denominational',
  'Baptist',
  'Methodist',
  'Presbyterian',
  'Catholic',
  'Pentecostal',
  'Lutheran',
  'Wesleyan',
  'Orthodox',
  'Anglican',
  'Other',
];

const ATTENDANCE_RANGES: AttendanceRange[] = [
  '0-50',
  '50-125',
  '125-300',
  '300-500',
  '500-1000',
  '1000-2000',
  '2000+',
];

export default function Wizard({ isOpen, onClose, onComplete }: WizardProps) {
  const [step, setStep] = useState(1);
  
  // Screen 1 - Identity
  const [churchName, setChurchName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [email, setEmail] = useState('');
  
  // Screen 2 - Size + Global Footprint
  const [attendance, setAttendance] = useState<AttendanceRange>('300-500');
  const [globalPresenceStatus, setGlobalPresenceStatus] = useState<GlobalPresenceStatus>('no');
  const [regionPreference, setRegionPreference] = useState<RegionPreference>('complement_existing');
  const [existingRegions, setExistingRegions] = useState('');
  
  // Screen 3 - Constraints (sliders as 0-100 values)
  const [costSlider, setCostSlider] = useState(50);
  const [timeSlider, setTimeSlider] = useState(50);
  const [englishSlider, setEnglishSlider] = useState(50);
  
  // Screen 4 - Partnership Posture
  const [partnershipPosture, setPartnershipPosture] = useState<PartnershipPosture>('own_community');
  
  // Screen 5 - Mobilization
  const [mobilization, setMobilization] = useState<MobilizationOption[]>([]);
  const [spanishToggle, setSpanishToggle] = useState(false);
  
  // Screen 5 - Impact DNA (now supports multiple selections)
  const [impactDNA, setImpactDNA] = useState<ImpactDNA[]>([]);
  const [frontierType, setFrontierType] = useState<FrontierType | ''>('');

  // Convert slider value (0-100) to importance level
  const sliderToImportance = (value: number): ImportanceLevel => {
    if (value <= 33) return 'low';
    if (value <= 66) return 'medium';
    return 'high';
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete the wizard
      const wizardState: WizardState = {
        churchName,
        denomination,
        contactName,
        contactRole,
        email,
        attendance,
        globalPresenceStatus,
        regionPreference: globalPresenceStatus === 'yes' ? regionPreference : undefined,
        existingRegions: globalPresenceStatus === 'yes' && existingRegions ? existingRegions : undefined,
        costImportance: sliderToImportance(costSlider),
        timeAwayImportance: sliderToImportance(timeSlider),
        englishImportance: sliderToImportance(englishSlider),
        partnershipPosture,
        mobilization: mobilization.length > 0 ? mobilization : undefined,
        spanishToggle: mobilization.includes('spanish_speakers') || undefined,
        impactDNA: impactDNA.length > 0 ? impactDNA : undefined,
        frontierType: impactDNA.includes('frontier_hard_to_reach') && frontierType ? frontierType : undefined,
      };
      onComplete(wizardState);
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setStep(1);
    setChurchName('');
    setDenomination('');
    setContactName('');
    setContactRole('');
    setEmail('');
    setAttendance('300-500');
    setGlobalPresenceStatus('no');
    setRegionPreference('complement_existing');
    setExistingRegions('');
    setCostSlider(50);
    setTimeSlider(50);
    setEnglishSlider(50);
    setPartnershipPosture('own_community');
    setMobilization([]);
    setSpanishToggle(false);
    setImpactDNA([]);
    setFrontierType('');
    onClose();
  };

  const canProceed = () => {
    if (step === 1) {
      return churchName && denomination && contactName && contactRole && email;
    }
    if (step === 2) {
      return attendance;
    }
    if (step === 3) {
      return true; // Sliders always have values
    }
    if (step === 4) {
      return true; // Mobilization is optional
    }
    if (step === 5) {
      return impactDNA.length > 0;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6 gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`h-2 w-12 rounded-full transition-all ${
                num === step
                  ? 'bg-brand-teal'
                  : num < step
                  ? 'bg-brand-teal-light'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step indicator text */}
        <p className="text-center text-sm text-gray-500 mb-6">Step {step} of 5</p>

        {/* Step Content */}
        <div className="mb-8">
          {/* SCREEN 1 - IDENTITY */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-teal mb-2">
                Let's get to know your church
              </h2>
              <p className="text-gray-600 mb-6">
                We'll email you a PDF summary you can share with your team.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Church Name *
                  </label>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                    placeholder="e.g., First Community Church"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Denomination/Network *
                  </label>
                  <select
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {DENOMINATIONS.map((denom) => (
                      <option key={denom} value={denom}>
                        {denom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Role *
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                      placeholder="Pastor, Missions Leader, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                    placeholder="you@church.org"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2 - SIZE + GLOBAL FOOTPRINT */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-teal mb-2">
                Tell us about your church
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us recommend a partnership that fits your church without competing with what you're already doing well.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Attendance
                  </label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value as AttendanceRange)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                  >
                    {ATTENDANCE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Do you already have an active global missions presence?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'no', label: 'No (not currently)' },
                      { value: 'yes', label: 'Yes (we already partner internationally)' },
                      { value: 'not_sure', label: "Not sure / it's informal" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGlobalPresenceStatus(option.value as GlobalPresenceStatus)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          globalPresenceStatus === option.value
                            ? 'border-brand-teal bg-brand-teal-bg text-brand-teal-dark font-semibold'
                            : 'border-gray-300 hover:border-brand-teal-light'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional follow-up if they have global presence */}
                {globalPresenceStatus === 'yes' && (
                  <div className="space-y-4 pl-4 border-l-4 border-brand-teal-light">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Are you looking to complement what you already do, or explore a different part of the world?
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'complement_existing', label: "Complement what we're already doing" },
                          { value: 'different_region', label: 'Different region of the world' },
                          { value: 'not_sure', label: 'Not sure' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setRegionPreference(option.value as RegionPreference)}
                            className={`w-full p-3 rounded-lg border-2 text-left text-sm transition-all ${
                              regionPreference === option.value
                                ? 'border-brand-teal bg-brand-teal-bg text-brand-teal-dark font-semibold'
                                : 'border-gray-300 hover:border-brand-teal-light'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Where do you already have global partnerships? (Optional)
                      </label>
                      <input
                        type="text"
                        value={existingRegions}
                        onChange={(e) => setExistingRegions(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-teal focus:outline-none"
                        placeholder="e.g., Honduras, India"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 3 - CONSTRAINTS (SLIDERS) */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-teal mb-2">
                What matters most to your team?
              </h2>
              <p className="text-gray-600 mb-6">
                Some churches start with the most accessible trip; others prioritize the most frontier context.
              </p>
              
              <div className="space-y-8">
                {/* Cost Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Trip cost is a primary factor for us
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-24">Not important</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={costSlider}
                      onChange={(e) => setCostSlider(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #66B2B2 0%, #66B2B2 ${costSlider}%, #e5e7eb ${costSlider}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="text-xs text-gray-500 w-24 text-right">Extremely important</span>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Current: <span className="font-semibold text-brand-teal">{sliderToImportance(costSlider)}</span>
                  </p>
                </div>

                {/* Time Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Total time away (including travel) is a primary factor for us
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-24">Not important</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={timeSlider}
                      onChange={(e) => setTimeSlider(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #66B2B2 0%, #66B2B2 ${timeSlider}%, #e5e7eb ${timeSlider}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="text-xs text-gray-500 w-24 text-right">Extremely important</span>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Current: <span className="font-semibold text-brand-teal">{sliderToImportance(timeSlider)}</span>
                  </p>
                </div>

                {/* English Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    English being widely spoken is a primary factor for us
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-24">Not important</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={englishSlider}
                      onChange={(e) => setEnglishSlider(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #66B2B2 0%, #66B2B2 ${englishSlider}%, #e5e7eb ${englishSlider}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="text-xs text-gray-500 w-24 text-right">Extremely important</span>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Current: <span className="font-semibold text-brand-teal">{sliderToImportance(englishSlider)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4 - MOBILIZATION */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-teal mb-2">
                Who do you want to mobilize?
              </h2>
              <p className="text-gray-600 mb-6">
                This doesn't limit your options—every HopeChest country has meaningful ways to engage.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Who are you most excited to mobilize for partner visits (what some call mission trips)? (Select up to 4)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'students_young_adults', label: 'Students/young adults' },
                      { value: 'families_with_children', label: 'Families with Children' },
                      { value: 'teachers_educators', label: 'Teachers / educators' },
                      { value: 'medical_professionals', label: 'Medical professionals' },
                      { value: 'adults_seniors', label: 'Adults & seniors' },
                      { value: 'broad_church_wide', label: 'Broad church-wide' },
                      { value: 'small_groups_sunday_school', label: 'Small Groups/Sunday School Classes' },
                      { value: 'construction_teams', label: 'Construction Teams' },
                      { value: 'spanish_speakers', label: 'Spanish Speakers' },
                    ].map((option) => {
                      const isSelected = mobilization.includes(option.value as MobilizationOption);
                      const isDisabled = !isSelected && mobilization.length >= 4;
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            if (isSelected) {
                              setMobilization(mobilization.filter(m => m !== option.value));
                            } else if (mobilization.length < 4) {
                              setMobilization([...mobilization, option.value as MobilizationOption]);
                            }
                          }}
                          disabled={isDisabled}
                          className={`p-4 rounded-lg border-2 text-left text-sm transition-all ${
                            isSelected
                              ? 'border-brand-teal bg-brand-teal-bg text-brand-teal-dark font-semibold'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 hover:border-brand-teal-light'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-brand-teal border-brand-teal' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {mobilization.length >= 4 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Maximum 4 selections reached
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5 - IMPACT DNA */}
          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-teal mb-2">
                Your impact vision
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us recommend a community that fits your church's heart and calling.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What kind of impact stories are you hoping your church can tell? (Select all that apply)
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'education_schools', label: 'Education / schools / kids thriving' },
                      { value: 'health_medical', label: 'Health / medical support' },
                      { value: 'community_transformation', label: 'Community transformation / long-term development' },
                      { value: 'frontier_hard_to_reach', label: 'Frontier / hard-to-reach communities' },
                      { value: 'youth_development_leadership', label: 'Youth Development & Leadership' },
                      { value: 'friendship_model', label: 'Friendship Model (Relational / Holistic Partnership)' },
                      { value: 'carepoint_graduation', label: 'Graduation, not dependency: every CarePoint begins with a target graduation timeline (usually 8–15 years)' },
                    ].map((option) => {
                      const isSelected = impactDNA.includes(option.value as ImpactDNA);
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            if (isSelected) {
                              setImpactDNA(impactDNA.filter(dna => dna !== option.value));
                              if (option.value === 'frontier_hard_to_reach') {
                                setFrontierType('');
                              }
                            } else {
                              setImpactDNA([...impactDNA, option.value as ImpactDNA]);
                            }
                          }}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-brand-teal bg-brand-teal-bg text-brand-teal-dark font-semibold'
                              : 'border-gray-300 hover:border-brand-teal-light'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-brand-teal border-brand-teal' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Frontier Follow-up */}
                {impactDNA.includes('frontier_hard_to_reach') && (
                  <div className="pl-4 border-l-4 border-brand-teal-light">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What kind of frontier context resonates more?
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'minimal_infrastructure', label: 'Hard-to-reach communities with minimal infrastructure' },
                        { value: 'muslim_majority_context', label: 'Muslim-majority / high spiritual need context' },
                        { value: 'not_sure', label: 'Not sure' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFrontierType(option.value as FrontierType)}
                          className={`w-full p-3 rounded-lg border-2 text-left text-sm transition-all ${
                            frontierType === option.value
                              ? 'border-brand-teal bg-brand-teal-bg text-brand-teal-dark font-semibold'
                              : 'border-gray-300 hover:border-brand-teal-light'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              step === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              canProceed()
                ? 'bg-brand-orange hover:bg-brand-brown text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 5 ? 'Find My Perfect Match' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
