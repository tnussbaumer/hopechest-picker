'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Wizard from '../src/components/Wizard';
import Results from '../src/components/Results';
import { calculateCountryScores } from '../src/lib/scoring';
import { WizardState, ScoringResult } from '../src/types/wizard';

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState<WizardState | null>(null);
  const [scoringResults, setScoringResults] = useState<ScoringResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleWizardComplete = (answers: WizardState) => {
    setWizardAnswers(answers);
    
    // Calculate scores using the scoring engine
    const results = calculateCountryScores(answers);
    setScoringResults(results);
  };

  // Scroll to results after wizard completes
  useEffect(() => {
    if (scoringResults && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scoringResults]);

  const handleReset = () => {
    setWizardAnswers(null);
    setScoringResults(null);
  };

  return (
    <>
      {/* Wizard Modal */}
      <Wizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
      
      {scoringResults && wizardAnswers ? (
        /* RESULTS VIEW - After wizard completion */
        <main className="min-h-screen bg-gray-50 py-12" ref={resultsRef}>
          <div className="container mx-auto px-4">
            <Results
              wizardAnswers={wizardAnswers}
              scoringResults={scoringResults}
              onReset={handleReset}
            />
          </div>
        </main>
      ) : (
        /* LANDING PAGE - Before wizard completion */
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="HopeChest Partnership"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Brand Overlay - Dark gradient for text readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-brand-teal/90 via-brand-teal-dark/85 to-brand-brown/90"></div>

          {/* Content - Centered Stack */}
          <div className="relative z-20 max-w-3xl mx-auto px-8 text-center">
            {/* Logo - White filter */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/hopechest-logo.png"
                alt="HopeChest Logo"
                width={220}
                height={88}
                className="brightness-0 invert"
                priority
              />
            </div>

            {/* Headline - Have Heart Brand Font */}
            <h1 className="font-brand text-6xl md:text-7xl text-white mb-6 leading-tight">
              Find Your Perfect Partnership
            </h1>

            {/* Subtext - Open Sans */}
            <p className="font-sans text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Connect your church's heart with a community's greatest needs through a localized, long-term partnership.
            </p>

            {/* CTA Button - Bright contrasting color */}
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-block bg-brand-tan hover:bg-yellow-300 text-brand-brown font-bold text-xl px-12 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-200/50"
            >
              Start Your Journey
            </button>
          </div>
        </main>
      )}
    </>
  );
}
